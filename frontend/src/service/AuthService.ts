import axios from "axios";
import api from "../api/axiosInstance";



export const registerService = async (formData: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => {
    console.log("Submitting registration with data:", formData);
  const response = await api.post(`/api/users/register`, formData);
  console.log("Registration response:", response.data);
  return response;
};

export const loginService = async (credentials: {
  email: string;
  password: string;
}) => {
  console.log("Submitting login request with:", credentials);
  const response = await api.post(`/api/users/login`, credentials);
  console.log("Login response data:", response.data);
  return response;
};

export const googleAuthService = async (idToken: string) => {
  const response = await api.post(`/api/users/google`, { token: idToken });
  return response;
};

export const verifyOtpService = async (data: { email: string; otp: string }) => {
  return api.post(`/api/users/verify-otp`, data);
};

export const resendOtpService = (data: { email: string }) => {
  return api.post(`/api/users/resend-otp`, data);
};

export const forgotPasswordService = async (email: string) => {
  if (!email) throw new Error("Email is required");

  return api.post(`/api/users/forgot-password`, { email });
};

export const resetPasswordService = async ({
  token,
  password,
}: {
  token: string;
  password: string;
}) => {
  return api.post(`/api/users/reset-password`, { token, password });
};
