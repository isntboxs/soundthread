import { TRPCError } from "@trpc/server";
import z from "zod";

import { spotifyService } from "@/lib/spotify";
import { createTRPCRouter, publicProcedure } from "@/trpc";

export const spotifyRouter = createTRPCRouter({
	searchTrack: publicProcedure
		.input(
			z.object({
				query: z.string(),
			})
		)
		.query(async ({ input }) => {
			const token = await spotifyService.getAccessToken();

			const { data, error } = await spotifyService.searchTrack(
				token.access_token,
				input.query
			);

			if (error) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: error.message,
				});
			}

			const tracks = data?.tracks;

			return tracks;
		}),

	getTrack: publicProcedure
		.input(
			z.object({
				trackId: z.string(),
			})
		)
		.query(async ({ input }) => {
			const token = await spotifyService.getAccessToken();

			const { data, error } = await spotifyService.getTrack(
				token.access_token,
				input.trackId
			);

			if (error) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: error.message,
				});
			}

			return data;
		}),
});
