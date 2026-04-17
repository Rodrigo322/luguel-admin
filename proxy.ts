import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

function readBackendOrigin(request: NextRequest): string {
  return process.env.BACKEND_ORIGIN ?? request.nextUrl.origin;
}

async function fetchSession(request: NextRequest): Promise<{
  user?: { id: string; email: string; name: string; role: "LOCADOR" | "LOCATARIO" | "ADMIN" };
} | null> {
  try {
    const response = await fetch(`${readBackendOrigin(request)}/api/v1/auth/session`, {
      method: "GET",
      headers: {
        cookie: request.headers.get("cookie") ?? ""
      },
      cache: "no-store"
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as {
      user: { id: string; email: string; name: string; role: "LOCADOR" | "LOCATARIO" | "ADMIN" };
    };
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  const session = await fetchSession(request);
  const isPublic = isPublicPath(pathname);

  if (!session?.user && !isPublic) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (session?.user && isPublic) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (session?.user && session.user.role !== "ADMIN" && !isPublic) {
    return NextResponse.redirect(new URL("/login?error=admin-only", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
