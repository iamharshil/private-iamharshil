import React, { useEffect } from "react";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { useRouter } from "next/navigation";

export default function Verify() {
	const router = useRouter();
	const [value, setValue] = React.useState("");

	useEffect(() => {
		if (value.length === 6) {
			if (value === "123456") {
				if (value === 614910) {
					(async () => {
						await fetch("/verify", {
							method: "POST",
							body: JSON.stringify({ otp: value }),
						})
							.then((res) => res.json())
							.then((data) => {
								return router.push("/");
							})
							.catch((err) => {
								console.log(err);
							});
					})();
				}
			}
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
