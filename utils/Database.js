import mongoose from "mongoose";
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
	throw new Error(
		"Please define the MONGODB_URI environment variable inside .env.local",
	);
}

const connection = {};

async function Database() {
	if (connection.isConnected) {
		console.log("⚙ => using existing database connection");
		return;
	}

	try {
		const db = await mongoose.connect(MONGODB_URI || "");
		connection.isConnected = db.connections[0].readyState;

		console.log("⚙ => new database connection");
	} catch (error) {
		console.log("⚙ => error connecting to database:", error);
		process.exit(1);
	}
}

export default Database;
