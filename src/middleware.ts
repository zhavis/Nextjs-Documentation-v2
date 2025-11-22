import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login", "/signup", "/verifyemail"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value || "";
  const isPublic = PUBLIC_PATHS.includes(pathname);

  if (token && isPublic) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  if (!token && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/getting-started",
    "/profile",
    "/guides",
    '/introduction',
    "/faq",
    "/login",
    "/signup",
    "/verifyemail",
  ],
};
