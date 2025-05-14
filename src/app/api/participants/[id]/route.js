import { NextResponse } from 'next/server';
import {getParticipantById } from '@/actions/participant';

export async function GET(req, {params}) {
    const { id } = await params;
    try {
        const participant = await getParticipantById(id);
        if(!participant){
            return NextResponse.json({error: 'Participant not found'}, {status: 404});
        }
        return NextResponse.json({ ...participant }, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}