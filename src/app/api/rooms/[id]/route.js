import { NextResponse } from "next/server";
import { getRoomById } from "@/actions/room";

export async function GET(req, {params}) {
    const { id } = await params;
    try {
        const room = await getRoomById(id);
        return NextResponse.json(room, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}