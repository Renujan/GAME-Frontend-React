import axiosInstance from "./axiosInstance";
import { API_CONFIG } from "@/config/api";

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface LoginStep1Response {
  otp_sent: boolean;
  email: string;
}

export interface OtpVerifyData {
  email: string;
  otp: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user?: {
    id: number;
    username: string;
    email: string;
    role?: string;
    score?: number;
    coins?: number;
  };
}

export interface RegisterResponse {
  id: number;
  username: string;
  email: string;
}

export const authService = {
  register: async (data: RegisterData): Promise<RegisterResponse> => {
    const response = await axiosInstance.post(API_CONFIG.ENDPOINTS.REGISTER, data);
    return response.data;
  },

  loginStep1: async (data: LoginData): Promise<LoginStep1Response> => {
    const response = await axiosInstance.post(API_CONFIG.ENDPOINTS.LOGIN, data);
    return response.data;
  },

  verifyOtp: async (data: OtpVerifyData): Promise<AuthResponse> => {
    const response = await axiosInstance.post(API_CONFIG.ENDPOINTS.VERIFY_OTP, data);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await axiosInstance.post(API_CONFIG.ENDPOINTS.LOGIN, data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      await axiosInstance.post(API_CONFIG.ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
    }
  },
};
