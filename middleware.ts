import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BOT_USER_AGENTS = [
  "googlebot",
  "bingbot",
  "slurp",
  "duckduckbot",
  "baiduspider",
  "yandexbot",
  "sogou",
];

// Paths that should not be indexed by search engines
const NOINDEX_PATHS = ["/auth/login", "/auth/signup"];

// Public paths that don't require authentication
const PUBLIC_PATHS = [
  "/",
  "/auth/login",
  "/auth/signup",
  "/auth/reset-password",
  "/auth/update-password",
  "/auth/callback",
  "/about-us",
];

function handleBots(req: NextRequest) {
  const userAgent = req.headers.get("user-agent")?.toLowerCase() || "";

  if (BOT_USER_AGENTS.some((bot) => userAgent.includes(bot))) {
    return NextResponse.next();
  }

  return null;
}

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((path) => {
    if (path.endsWith("*")) {
      return pathname.startsWith(path.slice(0, -1));
    }
    return pathname === path || pathname.startsWith(path + "/");
  });
}

export function middleware(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname;

    // Clone the request headers and add pathname for SEO metadata
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-pathname", pathname);

    // Check for bots before authentication
    const botResponse = handleBots(request);
    if (botResponse) {
      // Add pathname header even for bot responses
      botResponse.headers.set("x-pathname", pathname);
      return botResponse;
    }

    // Check if current path should have noindex header
    const shouldNoIndex = NOINDEX_PATHS.some((path) =>
      pathname.startsWith(path)
    );

    // If the route is public, allow it
    if (isPublicPath(pathname)) {
      const response = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
      if (shouldNoIndex) {
        response.headers.set("X-Robots-Tag", "noindex, nofollow");
      }
      return response;
    }

    // Check for authentication token
    const token = request.cookies.get("supabase_token");

    // If no token and route is protected, redirect to sign-in
    if (!token) {
      const signInUrl = new URL("/signin", request.url);
      signInUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Create response for authenticated users
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    // Add noindex header for protected/sensitive routes
    if (shouldNoIndex) {
      response.headers.set("X-Robots-Tag", "noindex, nofollow");
    }

    return response;
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt (robots file)
     * - sitemap.xml (sitemap file)
     * - .well-known (security files)
     */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.well-known).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
