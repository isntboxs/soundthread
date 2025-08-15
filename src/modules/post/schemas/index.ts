import { z } from "zod";

export const createPostSchema = z.object({
	title: z
		.string()
		.min(3, "Title must be at least 3 characters long")
		.max(100, "Title must be at most 100 characters long"),
	content: z
		.string()
		.min(1, "Content is required")
		.max(1000, "Content must be at most 1000 characters long"),
});

export type CreatePostSchema = z.infer<typeof createPostSchema>;
