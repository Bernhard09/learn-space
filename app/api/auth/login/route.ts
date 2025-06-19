import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import { loginSchema } from '@/lib/schemas';

const prisma = new PrismaClient();
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function POST(request: Request) {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }

    const body = await request.json();
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
        return NextResponse.json(validation.error.errors, { status: 400 });
    }

    const { email, password } = validation.data;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return new Response('Invalid credentials', { 
            status: 401,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: MAX_AGE,
    });

    const cookie = serialize('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        domain: process.env.NODE_ENV === 'production' ? process.env.DOMAIN : undefined,
        maxAge: MAX_AGE,
        path: '/',
    });

    return new Response(JSON.stringify({ 
        message: 'Logged in',
        user: {
            id: user.id,
            email: user.email
        }
    }), {
        status: 200,
        headers: { 
            'Set-Cookie': cookie,
            'Content-Type': 'application/json'
        },
    });
}