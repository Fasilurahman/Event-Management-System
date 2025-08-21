import { AppError } from "../../../shared/AppError";
import { getUserDetailsByEmail, storeUserDetailsWithOTP } from "../../../infrastructure/services/OtpStore";
import { sendEmail } from "../../../infrastructure/services/EmailService";

export class ResendOtpUseCase {
  async execute(email: string) {
    try {
      const userDetails = getUserDetailsByEmail(email);
      if (!userDetails) {
        throw new AppError("No user details found for this email", 400);
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      console.log(`Generated OTP for ${email}: ${otp}`);

      storeUserDetailsWithOTP(email, otp, userDetails);

      const subject = "Your OTP for Registration";
      const message = `Hello ${userDetails.name},\n\nThis is your **resend OTP**: ${otp}\nIt is valid for 5 minutes.\n\nThank you!`;

      await sendEmail(email, subject, message);

      return { message: "OTP resent successfully" };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new AppError(error.message, 400);
      }
      throw new AppError("Unknown error", 400);
    }
  }
}
