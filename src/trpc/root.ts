import { createCallerFactory, createTRPCRouter } from "@/trpc";
import { postRouter } from "@/trpc/routers/post";
import { spotifyRouter } from "@/trpc/routers/spotify";

// create router
export const appRouter = createTRPCRouter({
	post: postRouter,
	spotify: spotifyRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

// create a server-side caller for the tRPC API
export const createCaller = createCallerFactory(appRouter);
