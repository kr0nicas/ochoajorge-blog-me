import { NextResponse } from "next/server";

const locales = ["es", "en"];
const defaultLocale = "es";

export function middleware(request) {
    const pathname = request.nextUrl.pathname;

    // Check if pathname already has a locale
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (pathnameHasLocale) return;

    // Redirect if there is no locale
    const locale = defaultLocale;
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname}`;

    // URL transformation for localized routes
    return NextResponse.redirect(url);
}

export const config = {
    matcher: [
        "/((?!api|_next|favicon.ico|feed.xml|icon.png|og.png).*)",
    ],
};
