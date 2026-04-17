export type Role = "ADMIN" | "SELLER" | "CUSTOMER";

export interface SignUpData {
  name: string;
  email: string;
  password?: string;
}

export interface AuthResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface VerifyEmailData {
  email: string;
  code: string;
}
