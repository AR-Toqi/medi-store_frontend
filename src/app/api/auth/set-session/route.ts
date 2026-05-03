import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const accessToken = searchParams.get("accessToken");
  const refreshToken = searchParams.get("refreshToken");
  const sessionToken = searchParams.get("sessionToken");

  if (!accessToken) {
    return NextResponse.redirect(new URL("/login?message=error", request.url));
  }

  const response = NextResponse.redirect(new URL("/login-success", request.url));
  const cookieStore = await cookies();

  const cookieOptions: any = {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  };

  // Set the cookies on the FRONTEND domain (First-Party)
  cookieStore.set("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 24 * 60 * 60, // 1 day
  });

  if (refreshToken) {
    cookieStore.set("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });
  }

  if (sessionToken) {
    cookieStore.set("better-auth.session_token", sessionToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });
  }

  return response;
}
