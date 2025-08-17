import { createPostSchema } from "@/modules/post/schemas";
import { createTRPCRouter, publicProcedure } from "@/trpc";

export const postRouter = createTRPCRouter({
	create: publicProcedure
		.input(createPostSchema)
		.mutation(async ({ ctx, input }) => {
			return ctx.db.post.create({
				data: {
					title: input.title,
					content: input.content,
					trackId: input.trackId,
				},
			});
		}),
});
