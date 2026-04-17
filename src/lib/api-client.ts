export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export async function fetcher<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  // Handle Set-Cookie headers for Server Actions / SSR
  if (typeof window === "undefined") {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const setCookieHeader = response.headers.get("set-cookie");
    if (setCookieHeader) {
      // Logic to parse and set each cookie
      // For simplicity, we can extract the main ones or use a parser
      const cookieStrings = setCookieHeader.split(/,(?=[^;]*=)/);
      cookieStrings.forEach(cookieString => {
        const [nameValue, ...parts] = cookieString.split(";");
        const [name, value] = nameValue.split("=");
        if (name && value) {
          const options: any = {
            path: "/",
            httpOnly: true,
            secure: true, // Always true if SameSite=None, browsers allow this on localhost
            sameSite: "none",
          };
          parts.forEach(part => {
             const [k, v] = part.trim().split("=");
             const key = k.toLowerCase();
             if (key === "max-age") options.maxAge = parseInt(v);
             if (key === "expires") options.expires = new Date(v);
             if (key === "path") options.path = v;
             if (key === "samesite") options.sameSite = v.toLowerCase();
             if (key === "secure") options.secure = true;
          });
          
          // Requirement: SameSite=None must be Secure
          if (options.sameSite === "none") {
            options.secure = true;
          }
          
          cookieStore.set(name.trim(), value.trim(), options);
        }
      });
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${response.status}`);
  }

  const data = await response.json();
  return data.data;
}
