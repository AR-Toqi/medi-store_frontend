"use server";

import { authService } from "@/services/auth.service";
import { signupSchema } from "@/zod/auth.validation";

export const signUpAction = async (data: any) => {
  const validatedFields = signupSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await authService.signup(validatedFields.data);
    return {
      success: true,
      message: result.message || "Signup successful",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Something went wrong. Please try again.",
    };
  }
};
