export const AUTH_COOKIE_NAME = "token";
export const AUTH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60;

export function authCookieOptions() {
    return {
        name: AUTH_COOKIE_NAME,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/",
        maxAge: AUTH_COOKIE_MAX_AGE,
    };
}
