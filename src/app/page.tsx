import { Suspense } from "react";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";

import { LatestPost } from "@/components/global/latest-post";
import { caller, getQueryClient, trpc } from "@/trpc/server";

export default async function HomePage() {
	const queryClient = getQueryClient();
	const hello = await caller.post.hello({ text: "kotak!" });

	void queryClient.prefetchQuery(trpc.post.getLatest.queryOptions());

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Suspense fallback={<p>Loading...</p>}>
				<ErrorBoundary fallback={<p>Something went wrong</p>}>
					<div>
						<p>{hello.greeting}</p>
						<LatestPost />
					</div>
				</ErrorBoundary>
			</Suspense>
		</HydrationBoundary>
	);
}
