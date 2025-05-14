import { NextResponse } from "next/server";
import { getRoomsOrderedByScore } from "@/actions/room";
export async function GET(req) {
    try {
        const rooms = await getRoomsOrderedByScore();
        return NextResponse.json(rooms, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}