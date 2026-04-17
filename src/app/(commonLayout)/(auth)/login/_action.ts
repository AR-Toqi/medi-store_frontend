"use server";

import { authService } from "@/services/auth.service";
import { loginSchema } from "@/zod/auth.validation";
import { unstable_rethrow } from "next/navigation";

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
    const result = await authService.login(validatedFields.data) as any;
    return {
      success: true,
      message: result.message || "Login successful",
      data: result, // This will include the user role and token
    };
  } catch (error: any) {
    unstable_rethrow(error);
    return {
      success: false,
      message: error.message || "Something went wrong. Please try again.",
    };
  }
};
