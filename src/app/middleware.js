import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;

  const pathname = request.nextUrl.pathname;

  // Only protect /Home
  const isHomePage = pathname.startsWith("/Home");

  if (!isHomePage) return NextResponse.next();

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  try {
    verify(token, process.env.JWT_SECRET);
    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}

// Only match `/Home` and its subroutes
export const config = {
  matcher: ["/Home/:path*"],
};
