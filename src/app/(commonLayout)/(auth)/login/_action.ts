"use server";

import { authService } from "@/services/auth.service";
import { loginSchema } from "@/zod/auth.validation";

export const loginAction = async (data: any) => {
  const validatedFields = loginSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await authService.login(validatedFields.data);
    return {
      success: true,
      message: result.message || "Login successful",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Something went wrong. Please try again.",
    };
  }
};
