"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CheckIcon, ChevronsUpDownIcon, Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useSpotifyGetTrack } from "@/hooks/spotify/use-get-track";
import { useSpotifySearchTrack } from "@/hooks/spotify/use-search-track";
import { cn } from "@/lib/utils";
import {
	createPostSchema,
	type CreatePostSchema,
} from "@/modules/post/schemas";
import { useTRPC } from "@/trpc/client";

export const PostSubmitView = () => {
	const [openSearch, setOpenSearch] = useState<boolean>(false);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [trackId, setTrackId] = useState<string>("");

	const trpc = useTRPC();

	const form = useForm<CreatePostSchema>({
		resolver: zodResolver(createPostSchema),
		defaultValues: {
			title: "",
			content: "",
			trackId: "",
		},
		mode: "all",
	});

	const { data: searchTracksData } = useSpotifySearchTrack(searchQuery);

	const { data: trackData } = useSpotifyGetTrack(trackId);

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
									name="trackId"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Track</FormLabel>
											<Popover open={openSearch} onOpenChange={setOpenSearch}>
												<PopoverTrigger asChild>
													<FormControl>
														<Button
															variant="outline"
															role="combobox"
															className={cn(
																"w-full justify-between",
																!field.value ? "text-muted-foreground" : "h-16"
															)}
														>
															{field.value ? (
																<div className="flex items-center space-x-2">
																	<Avatar className="size-12 rounded-md">
																		<AvatarImage
																			src={
																				trackData?.album.images[2].url ??
																				trackData?.album.images[0].url
																			}
																		/>
																		<AvatarFallback>
																			{trackData?.artists[0].name
																				.charAt(0)
																				.toUpperCase() ?? ""}
																		</AvatarFallback>
																	</Avatar>

																	<div className="flex flex-shrink-0 flex-col items-start space-y-1">
																		<h3 className="max-w-44 flex-1 truncate text-sm leading-none font-medium sm:max-w-64 md:max-w-none">
																			{trackData?.name}
																		</h3>
																		<p className="text-muted-foreground max-w-44 flex-1 truncate text-xs sm:max-w-64 md:max-w-none">
																			{trackData?.artists
																				.map((artist) => artist.name)
																				.join(", ")}
																		</p>
																	</div>
																</div>
															) : (
																"Select a track"
															)}
															<ChevronsUpDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
														</Button>
													</FormControl>
												</PopoverTrigger>

												<PopoverContent className="h-[14rem] w-[var(--radix-popover-trigger-width)] p-0">
													<Command>
														<CommandInput
															placeholder="Search tracks..."
															value={searchQuery}
															onValueChange={(search) => setSearchQuery(search)}
														/>
														<CommandList>
															{!searchQuery || !searchTracksData ? (
																<CommandEmpty>No results found.</CommandEmpty>
															) : (
																<CommandGroup>
																	{searchTracksData.items.map((track) => (
																		<CommandItem
																			key={track.id}
																			value={`${track.id}-${track.name}-${track.artists[0].name}`}
																			onSelect={() => {
																				field.onChange(track.id);
																				setTrackId(track.id);
																				setOpenSearch(false);
																			}}
																		>
																			<div className="flex items-center">
																				<div className="flex-shrink-0">
																					<Avatar className="size-12 rounded-md">
																						<AvatarImage
																							src={
																								track.album.images[2].url ??
																								track.album.images[0].url
																							}
																						/>

																						<AvatarFallback>
																							{track.artists[0].name
																								.charAt(0)
																								.toUpperCase() ?? ""}
																						</AvatarFallback>
																					</Avatar>
																				</div>

																				<div className="ml-2 space-y-1">
																					<h3 className="line-clamp-1 text-base leading-none font-medium">
																						{track.name}
																					</h3>
																					<p className="text-muted-foreground line-clamp-1 text-sm">
																						{track.artists
																							.map((artist) => artist.name)
																							.join(", ")}
																					</p>
																				</div>
																			</div>

																			<CheckIcon
																				className={cn(
																					"ml-auto",
																					field.value === track.id
																						? "opacity-100"
																						: "opacity-0"
																				)}
																			/>
																		</CommandItem>
																	))}
																</CommandGroup>
															)}
														</CommandList>
													</Command>
												</PopoverContent>
											</Popover>
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
