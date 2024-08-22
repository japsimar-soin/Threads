// Repost.js
import mongoose from "mongoose";

const repostSchema = new mongoose.Schema(
	{
		post: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Post",
			required: true,
		},
		repostedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{ timestamps: true }
);


const Repost = mongoose.model("Repost", repostSchema);
export default Repost;