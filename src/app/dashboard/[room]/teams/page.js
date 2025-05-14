
export const metadata = {
    title: "Teams | Connessi al futuro",
    robots: "noindex, nofollow",
};

// import main page componente
import Teams from "./Teams";

// import loader to set server data to store
import TeamsLoader from "@/components/logic/TeamsLoader";

// import actions
import { getTeams } from "@/actions/team";

export default async function Page() {
    const teams = await getTeams();
    return(
        <>
            <TeamsLoader initialTeams={teams} />
            <Teams />
        </>
    );
}