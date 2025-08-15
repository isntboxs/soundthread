"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	createPostSchema,
	type CreatePostSchema,
} from "@/modules/post/schemas";
import { useTRPC } from "@/trpc/client";

export const PostSubmitView = () => {
	const trpc = useTRPC();

	const form = useForm<CreatePostSchema>({
		resolver: zodResolver(createPostSchema),
		defaultValues: {
			title: "",
			content: "",
		},
		mode: "all",
	});

	const createPost = useMutation(
		trpc.post.create.mutationOptions({
			onSuccess: () => {
				toast.success("Post created successfully", {
					id: "create-post-success",
				});
				form.reset();
			},
			onError: (error) => {
				toast.error("Failed to create post", {
					id: "create-post-error",
					description: error.message,
				});
			},
		})
	);

	const onSubmitForm = (data: CreatePostSchema) => {
		createPost.mutate(data);
	};

	return (
		<div className="w-full">
			<Card className="mx-auto mt-12">
				<CardHeader>
					<CardTitle>Create Post</CardTitle>
					<CardDescription>Let&apos;s create a new post</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmitForm)}
							className="space-y-6"
						>
							<div className="space-y-4">
								<FormField
									control={form.control}
									name="title"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Title</FormLabel>
											<FormControl>
												<Input
													placeholder="Title"
													disabled={createPost.isPending}
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="content"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Content</FormLabel>
											<FormControl>
												<Textarea
													placeholder="Content"
													disabled={createPost.isPending}
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<Button
								type="submit"
								className="w-full"
								disabled={createPost.isPending || !form.formState.isValid}
							>
								{createPost.isPending ? (
									<>
										<Loader2Icon className="mr-2 animate-spin" /> Creating...
									</>
								) : (
									"Create Post"
								)}
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
};
