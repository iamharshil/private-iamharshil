import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";

const sessionOptions = {
	cookieName: "login_token",
	password: String(process.env.IRON_SESSION_PASSWORD),
	cookieOptions: {
		secure: process.env.NODE_ENV === "production",
	},
};

export function withSessionRoute(handler) {
	return withIronSessionApiRoute(handler, sessionOptions);
}

export function withSessionSsr(handler) {
	return withIronSessionSsr(handler, sessionOptions);
}
