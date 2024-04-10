import { Schema, model, models } from "mongoose";

export default models.Posts ||
	model(
		"Posts",
		new Schema(
			{
				title: {
					type: String,
					required: true,
				},
				content: {
					type: String,
					required: true,
				},
			},
			{ versionKey: false, timestamps: true },
		),
	);
