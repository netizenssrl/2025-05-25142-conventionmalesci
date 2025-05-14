import { NextResponse } from "next/server";
import { getResults } from "@/actions/votingsession";
export async function GET(req, {params}) {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const bTeamPointsEnabled = searchParams.get("bTeamPointsEnabled") === "true";
    const bRoomPointsEnabled = searchParams.get("bRoomPointsEnabled") === "true";
    const roomId = searchParams.get("roomId");
    try {
        const votingSession = await getResults(id, bTeamPointsEnabled, bRoomPointsEnabled, roomId);
        return NextResponse.json(votingSession, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}