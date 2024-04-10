import React, { useEffect } from "react";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from "@/components/ui/input-otp";
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
		<main className="h-screen w-screen">
			<div className="container flex align-middle justify-center h-screen">
				<InputOTP
					maxLength={6}
					value={value}
					onChange={(value) => setValue(value)}
					className="md:w-1/2 lg:w-1/3"
				>
					<InputOTPGroup>
						<InputOTPSlot index={0} />
						<InputOTPSlot index={1} />
						<InputOTPSlot index={2} />
					</InputOTPGroup>
					<InputOTPSeparator />
					<InputOTPGroup>
						<InputOTPSlot index={3} />
						<InputOTPSlot index={4} />
						<InputOTPSlot index={5} />
					</InputOTPGroup>
				</InputOTP>
			</div>
		</main>
	);
}
