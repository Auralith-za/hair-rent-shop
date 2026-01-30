import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

// Hard-coded admin credentials
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'Hairrent123#';

// Secret key for JWT signing (in production, this should be in environment variables)
const SECRET_KEY = process.env.JWT_SECRET || 'hair-rent-shop-secret-key-change-in-production';
const key = new TextEncoder().encode(SECRET_KEY);

export interface SessionPayload {
    username: string;
    expiresAt: Date;
}

// Verify admin credentials
export function verifyCredentials(username: string, password: string): boolean {
    return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

// Create session token
export async function createSession(username: string): Promise<string> {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const token = await new SignJWT({ username })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(expiresAt)
        .sign(key);

    return token;
}

// Verify session token
export async function verifySession(token: string): Promise<SessionPayload | null> {
    try {
        const verified = await jwtVerify(token, key);
        return {
            username: verified.payload.username as string,
            expiresAt: new Date((verified.payload.exp || 0) * 1000),
        };
    } catch (error) {
        return null;
    }
}

// Set session cookie
export async function setSessionCookie(token: string) {
    const cookieStore = await cookies();
    cookieStore.set('session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/',
    });
}

// Get session from cookie
export async function getSession(): Promise<SessionPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;

    if (!token) {
        return null;
    }

    return verifySession(token);
}

// Delete session cookie
export async function deleteSession() {
    const cookieStore = await cookies();
    cookieStore.delete('session');
}
