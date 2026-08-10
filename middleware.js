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

    // 308 (permanent) so search engines consolidate signals onto the localized
    // URL instead of treating /es as a temporary destination.
    return NextResponse.redirect(url, 308);
}

export const config = {
    matcher: [
        // Locale-agnostic files must be excluded here, or the middleware prefixes
        // them with /es and they 404. llms.txt was missing and did exactly that.
        "/((?!api|_next|favicon.ico|feed.xml|icon.png|llms.txt|og.png|opengraph-image|robots.txt|sitemap.xml).*)",
    ],
};
