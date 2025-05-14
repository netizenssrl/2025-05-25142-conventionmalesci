"use client";

// import hooks
import { useEffect } from "react";

// import stores
import { useTeamStore} from "@/stores/team";

export default function TeamsLoader({initialTeams}) {
    const setTeams = useTeamStore((state) => state.setTeams);
    useEffect(() => {
        setTeams(initialTeams);
    }, [initialTeams, setTeams]);
    return null;
}