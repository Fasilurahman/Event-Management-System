import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../constants/types';
import { RegisterUserUseCase } from '../../application/usecases/user/RegisterUserUseCase';
import { LoginUserUseCase } from '../../application/usecases/user/LoginUserUseCase';
import { GoogleAuthUseCase } from '../../application/usecases/user/GoogleAuthUseCase';
import { VerifyOtpUseCase } from '../../application/usecases/user/VerifyOtpUseCase';
import { ResendOtpUseCase } from '../../application/usecases/user/ResendOtpUseCase';
import { ForgotPasswordUseCase } from '../../application/usecases/user/ForgotPasswordUseCase';
import { ResetPasswordUseCase } from '../../application/usecases/user/ResetPasswordUseCase';
import { GetAllUsersUseCase } from '../../application/usecases/user/GetAllUsersUseCase';
import { ToggleUserStatusUseCase } from '../../application/usecases/user/ToggleUserStatusUseCase';
import { RefreshTokenUseCase } from '../../application/usecases/user/RefreshTokenUseCase';
import { GetUserByIdUseCase } from '../../application/usecases/user/GetUserByIdUseCase';
import { STATUS_CODES } from '../../shared/constants/statusCodes';
import { MESSAGES } from '../../shared/constants/ResponseMessages';
import mongoose from 'mongoose';

@injectable()
export class UserController {
  constructor(
    @inject(TYPES.RegisterUserUseCase) private registerUserUseCase: RegisterUserUseCase,
    @inject(TYPES.LoginUserUseCase) private loginUserUseCase: LoginUserUseCase,
    @inject(TYPES.GoogleAuthUseCase) private googleAuthUseCase: GoogleAuthUseCase,
    @inject(TYPES.VerifyOtpUseCase) private verifyOtpUseCase: VerifyOtpUseCase,
    @inject(TYPES.ResendOtpUseCase) private resendOtpUseCase: ResendOtpUseCase,
    @inject(TYPES.ForgotPasswordUseCase) private forgotPasswordUseCase: ForgotPasswordUseCase,
    @inject(TYPES.ResetPasswordUseCase) private resetPasswordUseCase: ResetPasswordUseCase,
    @inject(TYPES.GetAllUsersUseCase) private getAllUsersUseCase: GetAllUsersUseCase,
    @inject(TYPES.ToggleUserStatusUseCase) private toggleUserStatusUseCase: ToggleUserStatusUseCase,
    @inject(TYPES.RefreshTokenUseCase) private refreshTokenUseCase: RefreshTokenUseCase,
    @inject(TYPES.GetUserByIdUseCase) private getUserByIdUseCase: GetUserByIdUseCase
  ) {}

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("Registering user with data:", req.body);
      const user = await this.registerUserUseCase.execute(req.body);
      res.status(STATUS_CODES.CREATED).json({ success: true, message: MESSAGES.AUTH.REGISTER_SUCCESS, user });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("Logging in user with data:", req.body);
      const loginResult = await this.loginUserUseCase.execute(req.body);
      if (!loginResult) {
        return res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json({ success: false, message: MESSAGES.AUTH.INVALID_CREDENTIALS });
      }

      const { user, token, refreshToken } = loginResult;

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(STATUS_CODES.OK).json({
        success: true,
        message: MESSAGES.AUTH.LOGIN_SUCCESS,
        user,
        token,
      });
    } catch (error) {
      next(error);
    }
  }

  async googleLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.body;
      console.log("Google login with token:", token);
      const loginResult = await this.googleAuthUseCase.execute(token);
      res.status(STATUS_CODES.OK).json({ success: true, message: MESSAGES.AUTH.LOGIN_SUCCESS, user: loginResult.user, token: loginResult.token });
    } catch (error) {
      next(error);
    }
  }

  async verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, otp } = req.body;
      if (!email || !otp) {
        return res.status(400).json({ success: false, message: 'Email and OTP are required' });
      }

      const user = await this.verifyOtpUseCase.execute(email, otp);
      res.status(200).json({
        success: true,
        message: 'OTP verified successfully',
        user,
      });
    } catch (error) {
      next(error);
    }
  }

  async resendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const result = await this.resendOtpUseCase.execute(email);
      res.status(STATUS_CODES.OK).json({ success: true, message: result.message, result });
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      console.log("Forgot password request for email:", email);
      await this.forgotPasswordUseCase.execute(email);
      res.status(STATUS_CODES.OK).json({ success: true, message: 'Password reset link sent to your email' });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, password } = req.body;
      await this.resetPasswordUseCase.execute(token, password);
      res
        .status(STATUS_CODES.OK)
        .json({ success: true, message: MESSAGES.AUTH.PASSWORD_RESET_SUCCESS });
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await this.getAllUsersUseCase.execute();
      console.log("Users:", users);
      res.status(200).json({ success: true, users });
    } catch (error) {
      next(error);
    }
  }

  async toggleUserStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = new mongoose.Types.ObjectId(req.params.id);
      const user = await this.toggleUserStatusUseCase.execute(userId);
      console.log("User:", user);
      res.status(200).json({ success: true, user });
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      console.log(refreshToken, 'refreshToken');
      const newAccessToken = await this.refreshTokenUseCase.execute(refreshToken);
      res.status(STATUS_CODES.OK).json({ success: true, accessToken: newAccessToken });
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('11111111111111');
      console.log(req.params.id, 'req params id');
      const userId = new mongoose.Types.ObjectId(req.params.id);
      const user = await this.getUserByIdUseCase.execute(userId);
      console.log("User:", user);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
}