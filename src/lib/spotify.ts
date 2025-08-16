import { betterFetch } from "@better-fetch/fetch";
import qs from "query-string";

import { env } from "@/env";
import type { SpotifySearchResponse } from "@/types/spotify/search";
import type { SpotifyTrackResponse } from "@/types/spotify/track";

interface SpotifyAccessToken {
	access_token: string;
	token_type: string;
	expires_in: number;
}

const SPOTIFY_BASE_API_URL = "https://api.spotify.com/v1";

const getSpotifyAccessToken = async () => {
	const client_id = env.SPOTIFY_CLIENT_ID;
	const client_secret = env.SPOTIFY_CLIENT_SECRET;
	const refresh_token = env.SPOTIFY_REFRESH_TOKEN;

	const buffer = Buffer.from(`${client_id}:${client_secret}`).toString(
		"base64"
	);

	const headers = {
		Authorization: `Basic ${buffer}`,
		"Content-Type": "application/x-www-form-urlencoded",
	};

	const response = await fetch("https://accounts.spotify.com/api/token", {
		method: "POST",
		headers,
		body: qs.stringify({
			grant_type: "refresh_token",
			refresh_token,
		}),
	});

	const data = (await response.json()) as SpotifyAccessToken;

	return data;
};

export const spotifyService = {
	getAccessToken: getSpotifyAccessToken,
	searchTrack: async (token: string, query: string) => {
		const { data, error } = await betterFetch<SpotifySearchResponse>(
			`${SPOTIFY_BASE_API_URL}/search`,
			{
				auth: {
					type: "Bearer",
					token,
				},
				query: {
					q: query,
					type: "track",
				},
			}
		);

		return { data, error };
	},

	getTrack: async (token: string, trackId: string) => {
		const { data, error } = await betterFetch<SpotifyTrackResponse>(
			`${SPOTIFY_BASE_API_URL}/tracks/${trackId}`,
			{
				auth: {
					type: "Bearer",
					token,
				},
			}
		);

		return { data, error };
	},
};
