import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const ACCESS_COOKIE = "sc_access_token";
const REFRESH_COOKIE = "sc_refresh_token";

function cookieDomain(host?: string | null): string | undefined {
  if (host && /localhost|127\.0\.0\.1|\[::1\]|^192\.168\./.test(host)) {
    return undefined;
  }
  const env = process.env.NEXT_PUBLIC_COOKIE_DOMAIN;
  if (!env || env === "localhost") return undefined;
  return env;
}

function cookieOptions(host?: string | null) {
  const isLocal =
    !!host && /localhost|127\.0\.0\.1|\[::1\]|^192\.168\./.test(host);
  const opts: Record<string, string | number | boolean> = {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: !isLocal,
    maxAge: 60 * 60 * 24 * 30,
  };
  const domain = cookieDomain(host);
  if (domain) opts.domain = domain;
  return opts;
}

export async function POST(request: NextRequest) {
  let body: { access_token?: string; refresh_token?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "invalid json body" },
      { status: 400 }
    );
  }

  const { access_token, refresh_token } = body;
  if (!access_token || !refresh_token) {
    return NextResponse.json(
      { error: "access_token and refresh_token are required" },
      { status: 400 }
    );
  }

  const response = NextResponse.json({ ok: true });
  const host = request.headers.get("host");
  response.cookies.set(ACCESS_COOKIE, access_token, cookieOptions(host));
  response.cookies.set(REFRESH_COOKIE, refresh_token, cookieOptions(host));
  return response;
}

export async function DELETE(request: NextRequest) {
  const host = request.headers.get("host");
  const clearOptions = { path: "/", ...(cookieDomain(host) ? { domain: cookieDomain(host) } : {}) };
  const response = NextResponse.json({ ok: true });
  response.cookies.delete({ name: ACCESS_COOKIE, ...clearOptions });
  response.cookies.delete({ name: REFRESH_COOKIE, ...clearOptions });
  return response;
}
