"use server";

import { authService } from "@/services/auth.service";
import { verifyEmailSchema } from "@/zod/auth.validation";

export const verifyEmailAction = async (data: any) => {
  const validatedFields = verifyEmailSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await authService.verifyEmail(validatedFields.data);
    return {
      success: true,
      message: result.message || "Email verified successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Verification failed. Please check the code and try again.",
    };
  }
};
