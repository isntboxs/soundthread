import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

export const useSpotifySearchTrack = (query: string) => {
	const trpc = useTRPC();
	const queryOptions = trpc.spotify.searchTrack.queryOptions(
		{ query },
		{ enabled: !!query }
	);

	return useQuery(queryOptions);
};
