"use server";

import { authService } from "@/services/auth.service";
import { headers } from "next/headers";
import { unstable_rethrow, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export const getCurrentUserAction = async () => {
  try {
    const headerList = await headers();
    const user = await authService.getCurrentUser(headerList);
    return {
      success: true,
      data: user,
    };
  } catch (error: any) {
    unstable_rethrow(error);
    return {
      success: false,
      message: error.message || "Failed to fetch user",
    };
  }
};

export const logoutAction = async () => {
  try {
    await authService.logout();
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
  } catch (error: any) {
    unstable_rethrow(error);
    return {
      success: false,
      message: error.message || "Failed to logout",
    };
  }
  redirect("/login");
};

export const updateUserAction = async (formData: FormData) => {
  try {
    const result = await authService.updateUser(formData);
    revalidatePath("/profile");
    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    unstable_rethrow(error);
    return {
      success: false,
      message: error.message || "Failed to update profile",
    };
  }
};
