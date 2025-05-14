// middleware.js
import { NextResponse } from 'next/server';

export function middleware(req) {
    const url = req.nextUrl;
    if (!url.pathname.startsWith('/dashboard') && !url.pathname.startsWith('/api') && !url.pathname.startsWith('/build') && !url.pathname.startsWith('/_next')) {
        if (url.pathname.endsWith('/')) {
            url.pathname += 'index.html';
        }
        const filePath = url.pathname;
        return NextResponse.rewrite(new URL(filePath, req.url));
    }
    return NextResponse.next();
}
export const config = {
    matcher: '/:path*', // Si applica a tutte le rotte
}