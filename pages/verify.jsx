import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Verify() {
	const router = useRouter();
	const [value, setValue] = React.useState("");

	useEffect(() => {
		if (value.length === 6) {
			(async () => {
				await fetch("/api/verify", {
					method: "POST",
					body: JSON.stringify({ otp: value }),
				})
					.then((res) => res.json())
					.then(async (res) => {
						if (res.code === 200) {
							return router.push("/");
						}
						return toast.error(res.message);
					})
					.catch((err) => {
						return toast.error("Internal server error");
					});
			})();
		}
	}, [value, router]);
	return (
		<main className="h-screen w-screen bg-zinc-900 text-white">
			<div className="container flex align-middle justify-center h-screen">
				<div className="m-auto">
					<h2 className="text-gray-400 text-sm">Enter password here:</h2>
					<div className="flex flex-col">
						<input
							className="bg-gray-800 text-white rounded-lg px-4 py-2 text-center"
							maxLength={6}
							type="number"
							value={value}
							onChange={(e) => setValue(e.target.value)}
						/>
					</div>
				</div>
			</div>
		</main>
	);
}
