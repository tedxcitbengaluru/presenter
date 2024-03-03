import { Organization, User } from "@prisma/client";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient({ req, res });

  // Refresh session if expired - required for Server Components
  const sessionResponse = await supabase.auth.getSession();

  const currentSession = sessionResponse.data.session;

  if (currentSession) {
    if (req.nextUrl.pathname.startsWith("/login")) {
      console.log(req.nextUrl.basePath);
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl.basePath));
    }
    return res;
  }

  if (req.nextUrl.pathname.startsWith("/login")) {
    return res;
  }

  const redirectUrl = req.nextUrl.clone();
  redirectUrl.pathname = "/login";
  return NextResponse.redirect(redirectUrl);
}

// Ensure the middleware is only called for relevant paths.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
