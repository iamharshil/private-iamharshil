import React from "react";
import { withSessionSsr } from "@/lib/session";
import { useRouter } from "next/navigation";
import Link from "next/link";

export const getServerSideProps = withSessionSsr(
	async function getServerSideProps({ req }) {
		const user = req?.session?.user?._id;
		if (!user) {
			return {
				redirect: {
					destination: "/verify",
					permanent: false,
				},
			};
		}
		return {
			props: {
				verified: true,
			},
		};
	},
);

export default function Home() {
	const router = useRouter();
	const [posts, setPosts] = React.useState([]);

	async function fetchAllPosts() {
		await fetch("/api/posts/all")
			.then((res) => res.json())
			.then((res) => {
				if (res.success && res.code === 200) setPosts(res.data);
				if (res.code === 401) {
					return router.push("/verify");
				}
			})
			.catch((err) => {
				console.error(err);
			});
	}

	React.useEffect(() => {
		fetchAllPosts();
	}, []);

	return (
		<main className="h-screen w-screen bg-zinc-900 text-white">
			<div className="container pt-5">
				<div className="flex justify-between border-b border-gray-500 pb-2">
					<h2 className="text-2xl font-bold mb-2">Posts</h2>
					<button
						type="button"
						className="py-1 px-3 font-semibold border border-zinc-700 rounded-lg bg-black text-white hover:border-white"
						onClick={() => router.push("/new")}
					>
						Create New Post
					</button>
				</div>

				<div className="mt-3">
					{posts?.length > 0 ? (
						posts.map((post) => (
							<Link
								href={`/${encodeURIComponent(post.title)}`}
								key={post._id}
								className="flex flex-col truncate p-2 m-2 border rounded border-zinc-400 hover:border-gray-100"
							>
								<h3 className="text-lg font-semibold">{post.title}</h3>
								<p className="text-sm">{post.content}</p>
							</Link>
						))
					) : (
						<div>
							<p>No posts found!</p>
						</div>
					)}
				</div>
			</div>
		</main>
	);
}
