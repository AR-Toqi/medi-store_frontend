export const API_BASE_URL = typeof window !== "undefined" 
  ? "" // Use local proxy in the browser for same-origin cookies
  : (process.env.NEXT_PUBLIC_API_URL || "https://medi-store-backend-u9ux.onrender.com"); // Fallback for server-side/build

if (!API_BASE_URL && typeof window === "undefined") {
  console.warn("NEXT_PUBLIC_API_URL is not defined, using fallback");
}

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

interface ExtendedRequestInit extends RequestInit {
  isRetry?: boolean;
  skipRedirect?: boolean;
  skipRefresh?: boolean;
  returnFullResponse?: boolean;
}

/**
 * Handle Set-Cookie headers for Server Actions / SSR
 */
async function handleServerCookies(response: Response) {
  if (typeof window === "undefined") {
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      const setCookieHeader = response.headers.get("set-cookie");
      if (setCookieHeader) {
        // Logic to parse and set each cookie
        const cookieStrings = setCookieHeader.split(/,(?=[^;]*=)/);
        cookieStrings.forEach((cookieString) => {
          const [nameValue, ...parts] = cookieString.split(";");
          const [name, value] = nameValue.split("=");
          if (name && value) {
            const options: any = {
              path: "/",
              httpOnly: true,
              secure: true,
              sameSite: "none",
            };
            parts.forEach((part) => {
              const [k, v] = part.trim().split("=");
              const key = k.toLowerCase();
              if (key === "max-age") options.maxAge = parseInt(v);
              if (key === "expires") options.expires = new Date(v);
              if (key === "path") options.path = v;
              if (key === "samesite") options.sameSite = v.toLowerCase();
              if (key === "secure") options.secure = true;
            });

            if (options.sameSite === "none") {
              options.secure = true;
            }

            cookieStore.set(name.trim(), value.trim(), options);
          }
        });
      }
    } catch (error) {
      console.error("Error setting cookies on server:", error);
    }
  }
}

async function redirectToLogin() {
  const loginUrl = "/login?message=unauthorized";
  
  if (typeof window !== "undefined") {
    // Skip if already on a public page to prevent toast loops
    const publicPages = ["/login", "/signup", "/verify-email"];
    if (publicPages.some(page => window.location.pathname.startsWith(page))) {
      return;
    }
    window.location.href = loginUrl;
  } else {
    // On server, we can't easily check the current URL, 
    // but the Next.js redirect will handle it.
    const { redirect } = await import("next/navigation");
    redirect(loginUrl);
  }
}

export async function fetcher<T>(
  endpoint: string,
  options?: ExtendedRequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const fetchHeaders = new Headers(options?.headers);
  if (!fetchHeaders.get("Content-Type") && !(options?.body instanceof FormData)) {
    fetchHeaders.set("Content-Type", "application/json");
  }

  // Automatically attach cookies if on server
  if (typeof window === "undefined" && !fetchHeaders.get("Cookie")) {
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      const cookieString = cookieStore.toString();
      if (cookieString) {
        fetchHeaders.set("Cookie", cookieString);
      }
    } catch (error) {
      console.warn("Could not attach cookies to server-side fetch:", error);
    }
  }

  const response = await fetch(url, {
    ...options,
    headers: fetchHeaders,
    credentials: "include",
  });

  // Handle cookies for the current request
  await handleServerCookies(response);

  // Auto-refresh logic for 401 Unauthorized
  if (response.status === 401 && !options?.isRetry && !options?.skipRefresh && !endpoint.includes("/refresh-token")) {
    try {
      // Attempt to refresh the token
      const refreshResponse = await fetch(`${API_BASE_URL}/api/auth/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Pass cookies manually if on server
          ...(typeof window === "undefined" ? { Cookie: fetchHeaders.get("Cookie") || "" } : {}),
        },
        credentials: "include",
      });

      if (refreshResponse.ok) {
        // Sync new cookies from refresh response
        await handleServerCookies(refreshResponse);

        // Retry original request
        return fetcher<T>(endpoint, {
          ...options,
          isRetry: true,
        });
      } else {
        // Refresh failed, clear and redirect
        if (!options?.skipRedirect) {
          await redirectToLogin();
        }
      }
    } catch (error) {
       if (!options?.skipRedirect) {
         await redirectToLogin();
       }
    }
  }

  if (!response.ok) {
    if (response.status === 401 && !options?.skipRedirect) {
       await redirectToLogin();
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${response.status}`);
  }

  const data = await response.json();
  
  if (options?.returnFullResponse) {
    return data;
  }
  
  // Return nested data property if it exists, otherwise return the whole object
  return data.data !== undefined ? data.data : data;
}
