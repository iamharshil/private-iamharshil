import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(
	async function loginRoute(req, res) {
		if (req.method !== "POST")
			return res
				.status(405)
				.json({ success: false, code: 405, message: "Method not allowed" });

		try {
			const data = JSON.parse(req.body);

			if (!data.otp)
				return res
					.status(400)
					.json({ success: false, code: 400, message: "OTP is required" });

			if (data.otp.length !== 6) {
				return res
					.status(400)
					.json({ success: false, code: 400, message: "Invalid OTP" });
			}

			if (data.otp !== "614910") {
				return res
					.status(400)
					.json({ success: false, code: 400, message: "Invalid OTP" });
			}
			req.session.user = { _id: process.env.USER_ID };
			await req.session.save();

			return res.send({
				success: true,
				code: 200,
				message: "OTP verified successfully",
			});
		} catch (error) {
			console.log(">>> ~ file: verify.js:11 ~ handler ~ error:", error);
			return res
				.status(500)
				.json({ success: false, code: 500, message: "Internal server error" });
		}
	},
	{
		cookieName: "login_token",
		password: String(process.env.IRON_SESSION_PASSWORD),
		cookieOptions: {
			secure: process.env.NODE_ENV === "production" ? true : false,
		},
	},
);
