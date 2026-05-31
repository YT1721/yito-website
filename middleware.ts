import { NextResponse, type NextRequest } from "next/server";

const protectedPrefixes = ["/admin", "/api/upload"];
const protectedApiWrites = ["/api/content"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtectedPath = protectedPrefixes.some((prefix) =>
    pathname.startsWith(prefix),
  );
  const isProtectedWrite =
    protectedApiWrites.some((prefix) => pathname.startsWith(prefix)) &&
    request.method !== "GET";

  if (!isProtectedPath && !isProtectedWrite) {
    return NextResponse.next();
  }

  if (isAuthorized(request)) {
    return NextResponse.next();
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="YITO Admin"',
    },
  });
}

function isAuthorized(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Basic ")) return false;

  const encoded = authHeader.slice("Basic ".length);
  const decoded = atob(encoded);
  const separatorIndex = decoded.indexOf(":");

  if (separatorIndex === -1) return false;

  const username = decoded.slice(0, separatorIndex);
  const password = decoded.slice(separatorIndex + 1);

  return username === adminUsername() && password === adminPassword();
}

function adminUsername() {
  return process.env.ADMIN_USERNAME || "admin";
}

function adminPassword() {
  return process.env.ADMIN_PASSWORD || "yito2026";
}

export const config = {
  matcher: ["/admin/:path*", "/api/upload/:path*", "/api/content/:path*"],
};
