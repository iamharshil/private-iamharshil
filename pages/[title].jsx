import React from "react";
import { toast } from "sonner";
import { withSessionSsr } from "@/lib/session";
import { useRouter } from "next/router";
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

export default function Blog({ params }) {
	const router = useRouter();
	const [title, setTitle] = React.useState("");
	const [content, setContent] = React.useState("");

	async function getBlog() {
		await fetch("/api/posts/single", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ title: decodeURIComponent(router.query.title) }),
		})
			.then((res) => res.json())
			.then((res) => {
				if (res.code === 200) {
					setTitle(res.data.title);
					setContent(res.data.content);
					return;
				}
				if (res.code === 401) {
					return router.push("/verify");
				}
				toast.error(res.message);
			})
			.catch((error) => {
				toast.error("Something went wrong, please try again later");
			});
	}

	React.useEffect(() => {
		getBlog();
	}, []);

	return (
		<main className="h-screen w-screen bg-zinc-900 text-white">
			<div className="container pt-5">
				<div className="flex justify-between border-b border-gray-500 pb-2">
					<h2 className="text-2xl font-bold mb-2">{title}</h2>
				</div>

				<div className="mt-3">
					<div>
						<p>{content}</p>
					</div>
					<div className="mt-5">
						<Link
							className="py-1 px-3 font-semibold border border-zinc-700 rounded-lg bg-black text-white hover:border-white"
							href="/"
						>
							Go Back
						</Link>
					</div>
				</div>
			</div>
		</main>
	);
}
