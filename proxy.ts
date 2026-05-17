// PREVIEW MODE: Auth is bypassed so you can explore the UI without a database.
// When you're ready to connect PostgreSQL, restore real auth logic here.
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Redirect root to admin dashboard
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  // Redirect login to admin (no auth needed in preview)
  if (pathname === "/login") {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
