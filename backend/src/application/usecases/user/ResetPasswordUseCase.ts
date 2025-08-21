import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { AppError } from '../../../shared/AppError';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { TYPES } from '../../../constants/types';
import { inject, injectable } from 'inversify';


@injectable()
export class ResetPasswordUseCase {
    constructor(
      @inject(TYPES.IUserRepository) private userRepository: IUserRepository
    ) {}

  async execute(token: string, newPassword: string) {
    try {
      if (!token) throw new AppError('Invalid or missing token', 400);

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { email: string };
      if (!decoded.email) throw new AppError('Invalid token', 400);

      const user = await this.userRepository.findByEmail(decoded.email);
      if (!user) throw new AppError('User not found', 404);

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await this.userRepository.updatePassword(user._id, hashedPassword);

      return { message: 'Password reset successfully' };
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        throw new AppError('Reset token expired', 400);
      }
      throw new AppError(err.message || 'Failed to reset password', 400);
    }
  }
}
