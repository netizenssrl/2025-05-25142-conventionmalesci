import { NextResponse } from 'next/server';

import { logoutParticipant } from '@/actions/participant';
export async function PATCH(req, {params}){
    const { id } = await params;
    try {
        await logoutParticipant(id);
        return NextResponse.json({}, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
    }
}