"use client";

import { useState } from "react";

import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

export const LatestPost = () => {
	const [name, setName] = useState<string>("");

	const queryClient = useQueryClient();
	const trpc = useTRPC();

	const latestPostQuery = trpc.post.getLatest.queryOptions();
	const latestPostQueryKey = trpc.post.getLatest.queryKey();
	const { data: latestPost } = useSuspenseQuery(latestPostQuery);

	const createPostMutationOptions = trpc.post.create.mutationOptions({
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: latestPostQueryKey });
			setName("");
		},
	});
	const createPost = useMutation(createPostMutationOptions);

	return (
		<div className="space-y-4">
			{latestPost ? <p>{latestPost.name}</p> : <p>No posts yet</p>}

			<form
				className="space-y-2"
				onSubmit={(e) => {
					e.preventDefault();
					createPost.mutate({ name });
				}}
			>
				<Input
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
				<Button
					type="submit"
					disabled={createPost.isPending}
					className="w-full"
				>
					Create
				</Button>
			</form>
		</div>
	);
};
