import { withSessionRoute } from "@/lib/session";
import PostsModel from "@/models/Posts.model";
import Database from "@/utils/Database";

export default withSessionRoute(async function handler(req, res) {
	if (req.method !== "GET")
		return res
			.status(405)
			.json({ success: false, code: 405, message: "Method not allowed" });

	try {
		const user = req?.session?.user;
		if (!user) {
			await req.session.destroy();
			return res.send({ success: false, code: 401, message: "Unauthorized" });
		}
		if (user._id !== process.env.USER_ID) {
			await req.session.destroy();
			return res.send({ success: false, code: 401, message: "Unauthorized" });
		}
		await Database();
		const posts = await PostsModel.find().lean();
		return res.json({ success: true, code: 200, data: posts });
	} catch (error) {
		console.log(">>> ~ file: all.js:11 ~ handler ~ error", error);
		return res
			.status(500)
			.json({ success: false, code: 500, message: "Internal server error" });
	}
});
