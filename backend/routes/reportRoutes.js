import express from "express";
import Post from "../models/postModel.js";
import Report from "../models/reportModel.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.post("/report", protectRoute, async (req, res) => {
	const { postId, reason, reportedBy } = req.body;

	try {
		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const report = new Report({
			postId,
			reason,
			reportedBy,
		});
		await report.save();

		res.status(201).json({ message: "Report submitted successfully" });
	} catch (error) {
		res.status(500).json({ error: "Server error" });
	}
});

export default router;
