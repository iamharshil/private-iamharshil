import { withSessionRoute } from "@/lib/session";
import PostsModel from "@/models/Posts.model";
import Database from "@/utils/Database";

async function handler(req, res) {
	if (req.method !== "POST")
		return res
			.status(405)
			.json({ code: 405, success: false, message: "Method not allowed" });

	try {
		const data = req.body;
		if (!data.title)
			return res
				.status(400)
				.json({ code: 400, success: false, message: "Title is required" });

		if (data.title.length < 5) {
			return res.status(400).json({
				code: 400,
				success: false,
				message: "Title must be at least 5 characters",
			});
		}

		await Database();
		const blog = await PostsModel.findOne({ title: data.title });
		if (!blog) {
			return res
				.status(404)
				.json({ code: 404, success: false, message: "Blog not found" });
		}

		return res.status(200).json({ code: 200, success: true, data: blog });
	} catch (error) {
		console.log(">>> ~ file: single.js:12 ~ handler ~ error:", error);
		return res
			.status(500)
			.json({ code: 500, success: false, message: "Internal server error" });
	}
}

export default withSessionRoute(handler);
