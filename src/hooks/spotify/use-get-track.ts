import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

export const useSpotifyGetTrack = (trackId: string) => {
	const trpc = useTRPC();
	const queryOptions = trpc.spotify.getTrack.queryOptions(
		{ trackId },
		{ enabled: !!trackId }
	);

	return useQuery(queryOptions);
};
