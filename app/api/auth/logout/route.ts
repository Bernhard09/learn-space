import { serialize } from 'cookie';
import { NextResponse } from 'next/server';

/**
 * Handles POST requests to log the user out.
 * It clears the 'jwt' cookie by setting its expiration date to a time in the past.
 */
export async function POST() {
    const cookieName = 'jwt';

    // To instruct the browser to delete a cookie, you create a new cookie
    // with the same name and path, but set its maxAge to a negative value.
    // Think of it as telling the browser, "The validity for this cookie has already expired."
    const expiredCookie = serialize(cookieName, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: -1, // Expire the cookie immediately.
        path: '/',  // IMPORTANT: The path must match the one used when the cookie was set.
    });

    // We send back a success message and, most importantly, the 'Set-Cookie' header.
    // The browser sees this header and removes the stored cookie.
    return new NextResponse(JSON.stringify({ message: 'Logged out successfully' }), {
        status: 200,
        headers: {
            'Set-Cookie': expiredCookie,
            'Content-Type': 'application/json',
        },
    });
}