import { withSessionRoute } from "@/lib/session";
import Database from "@/utils/Database";
import PostsModel from "@/models/Posts.model";

async function handler(req, res) {
	if (req.method !== "POST")
		return res
			.status(405)
			.json({ code: 405, success: false, message: "Method not allowed" });

	try {
		const user = req?.session?.user;
		console.log(">>> ~ file: create.js:12 ~ handler ~ user:", user);
		if (!user) {
			await req.session.destroy();
			return res.send({ success: false, code: 401, message: "Unauthorized" });
		}

		if (user._id !== process.env.USER_ID) {
			await req.session.destroy();
			return res.send({ success: false, code: 401, message: "Unauthorized" });
		}

		const { title, content } = req.body;
		if (!title) {
			return res
				.status(400)
				.json({ code: 400, success: false, message: "Title is required" });
		}
		if (title.length < 5) {
			return res.status(400).json({
				code: 400,
				success: false,
				message: "Title must be at least 5 characters",
			});
		}

		if (!content) {
			return res
				.status(400)
				.json({ code: 400, success: false, message: "Content is required" });
		}

		if (content.length < 10) {
			return res.status(400).json({
				code: 400,
				success: false,
				message: "Content must be at least 10 characters",
			});
		}

		await Database();
		const isUnique = await PostsModel.findOne({ title });
		if (isUnique) {
			return res.status(400).json({
				code: 400,
				success: false,
				message: "Title already exists",
			});
		}

		const Post = await PostsModel.create({ title, content });

		if (!Post) {
			return res.status(400).json({
				code: 400,
				success: false,
				message: "Something went wrong, please try again later",
			});
		}

		return res.status(201).json({ code: 201, success: true });
	} catch (error) {
		console.log(">>> ~ file: create.js:13 ~ handler ~ error:", error);
		return res
			.status(500)
			.json({ code: 500, success: false, message: "Internal server error" });
	}
}

export default withSessionRoute(handler);
