import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const protectedRoutes = ["/create", "/my-properties", "/saved"];

function isProtectedPath(pathname: string) {
  if (protectedRoutes.some((path) => pathname === path)) return true;

  if (pathname.startsWith("/property/") && pathname.endsWith("/edit")) {
    return true;
  }

  return false;
}

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

    if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            req.cookies.set(name, value);
            res.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

if (!user) {
  const redirectUrl = req.nextUrl.clone();

  redirectUrl.pathname = "/auth";
  redirectUrl.searchParams.set("next", pathname);

  return NextResponse.redirect(redirectUrl);
}

  return res;
}

export const config = {
  matcher: ["/create", "/my-properties", "/saved", "/property/:path*/edit"],
};