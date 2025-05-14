import { NextResponse } from 'next/server';
import { loginParticipant } from '@/actions/participant';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const sEmail = searchParams.get('sEmail');

    try {
        if (!sEmail) {
            return NextResponse.json({ error: 'Indirizzo email non fornito' }, { status: 400 });
        }
        const participant = await loginParticipant(sEmail);

        if (!participant) {
            return NextResponse.json({ error: 'Indirizzo email non trovato' }, { status: 404 });
        }
        return NextResponse.json({ ...participant }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
    }
}
