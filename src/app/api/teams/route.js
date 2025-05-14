import { NextResponse } from "next/server";
import { getTeamsOrderedByScore } from "@/actions/team";
export async function GET(req) {
    try {
        const teams = await getTeamsOrderedByScore();
        return NextResponse.json(teams, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}