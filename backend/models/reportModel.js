import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
	{
		postId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Post",
			required: true,
		},
		reason: { type: String, required: true },
		reportedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{ timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);
export default Report;
