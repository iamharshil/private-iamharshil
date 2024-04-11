import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { withSessionSsr } from "@/lib/session";

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

export default function NewBlog() {
	const router = useRouter();
	const [title, setTitle] = React.useState("");
	const [content, setContent] = React.useState("");
	const [loading, setLoading] = React.useState(false);

	async function submitHandler(e) {
		e.preventDefault();

		if (!title) {
			return toast.error("Please enter title!");
		}
		if (!content) {
			return toast.error("Please enter content!");
		}
		if (title.length < 5) {
			return toast.error("Title must be at least 5 characters long!");
		}
		if (content.length < 10) {
			return toast.error("Content must be at least 10 characters long!");
		}

		setLoading(true);
		let res = await fetch("/api/posts/create", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ title, content }),
		});
		res = await res.json();
		console.log(">>> ~ file: new.jsx:68 ~ submitHandler ~ res:", res);
		if (res.code === 201) {
			setTitle("");
			setContent("");
			return router.push("/");
		}
		if (res.code === 401) {
			return router.push("/verify");
		}
		toast.error(res.message);
		setLoading(false);
	}

	return (
		<main className="h-screen w-screen bg-zinc-900 text-white">
			<div className="container pt-5">
				<div className="py-5">
					<h1 className="text-3xl font-bold">Create new blog</h1>
				</div>
				<form onSubmit={submitHandler}>
					<div className="flex flex-col my-2">
						<label
							for="title"
							class="block mb-2 text-sm font-medium text-white"
						>
							Title
						</label>
						<input
							id="title"
							placeholder="Enter title here..."
							className="border my-1 py-1 px-2 rounded bg-black text-white"
							onChange={(e) => setTitle(e.target.value)}
							value={title}
						/>
					</div>
					<div className="flex flex-col my-2">
						<label
							for="message"
							class="block mb-2 text-sm font-medium text-white"
						>
							Your message
						</label>
						<textarea
							id="message"
							rows="4"
							class="block p-2.5 w-full text-sm text-white bg-black rounded-lg border border-gray-300"
							placeholder="Write your thoughts here..."
							onChange={(e) => setContent(e.target.value)}
						>
							{content}
						</textarea>
					</div>
					<div className="flex space-x-2 my-5">
						<button
							type="button"
							className="py-1 px-3 font-semibold border border-zinc-700 rounded-lg bg-black text-white hover:border-white"
							disabled={loading}
							onClick={() => router.push("/")}
						>
							Cancel
						</button>
						<button
							type="submit"
							className="py-1 px-3 font-semibold border border-zinc-700 rounded-lg bg-black text-white hover:border-white"
							disabled={loading}
						>
							Create
						</button>
					</div>
				</form>
			</div>
		</main>
	);
}
