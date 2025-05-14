import { NextResponse } from "next/server";
import { getStatusByRoomId } from "@/actions/status";

export async function GET(req, {params}) {
    const {roomId} = await params;
    try {
        const status = await getStatusByRoomId(roomId !== "all" ? roomId : null, true);
        return NextResponse.json(status, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}