interface OtpRecord {
  otp: string;
  expires: number;
  userDetails: { name: string; email: string; password: string };
}

export const otpStore = new Map<string, OtpRecord>();

export function storeUserDetailsWithOTP(email: string, otp: string, userDetails: { name: string; email: string; password: string }) {
  otpStore.set(email, {
    otp,
    expires: Date.now() + 5 * 60 * 1000, 
    userDetails,
  });
}

export function verifyOtp(email: string, otp: string) {
  const record = otpStore.get(email);
  if (!record) return false;
  if (record.expires < Date.now()) {
    otpStore.delete(email);
    return false;
  }
  if (record.otp !== otp) return false;
  return true;
}

export function getUserDetailsByEmail(email: string) {
  const record = otpStore.get(email);
  return record?.userDetails;
}

export function removeOtp(email: string) {
  otpStore.delete(email);
}
