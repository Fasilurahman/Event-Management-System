import axios from "axios";
import api from "../api/axiosInstance";

const API_URL = "http://localhost:5000"; 


export const registerService = async (formData: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => {
    console.log("Submitting registration with data:", formData);
  const response = await api.post(`${API_URL}/api/users/register`, formData);
  console.log("Registration response:", response.data);
  return response;
};

export const loginService = async (credentials: {
  email: string;
  password: string;
}) => {
  console.log("Submitting login request with:", credentials);
  const response = await axios.post(`${API_URL}/api/users/login`, credentials);
  console.log("Login response data:", response.data);
  return response;
};

export const googleAuthService = async (idToken: string) => {
  const response = await axios.post(`${API_URL}/api/users/google`, { token: idToken });
  return response;
};

export const verifyOtpService = async (data: { email: string; otp: string }) => {
  return axios.post(`${API_URL}/api/users/verify-otp`, data);
};

export const resendOtpService = (data: { email: string }) => {
  return axios.post(`${API_URL}/api/users/resend-otp`, data);
};

export const forgotPasswordService = async (email: string) => {
  if (!email) throw new Error("Email is required");

  return axios.post(`${API_URL}/api/users/forgot-password`, { email });
};

export const resetPasswordService = async ({
  token,
  password,
}: {
  token: string;
  password: string;
}) => {
  return axios.post(`${API_URL}/api/users/reset-password`, { token, password });
};