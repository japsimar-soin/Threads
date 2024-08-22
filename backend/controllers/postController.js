import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import Repost from "../models/repostModel.js";
import { v2 as cloudinary } from "cloudinary";

const createPost = async (req, res) => {
	try {
		const { postedBy, text } = req.body;
		let { image } = req.body;
		if (!postedBy || !text) {
			return res
				.status(400)
				.json({ error: "postedBy, and text fields are required" });
		}

		const user = await User.findById(postedBy);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		if (user._id.toString() !== req.user._id.toString()) {
			return res.status(401).json({ error: "Not authorized" });
		}

		const maxLen = 500;
		if (text.length > maxLen) {
			return res
				.status(400)
				.json({ error: `Text limit: ${maxLen} characters.` });
		}

		if (image) {
			const uploadedPost = await cloudinary.uploader.upload(image);
			image = uploadedPost.secure_url;
		}

		const newPost = new Post({ postedBy, text, image });
		await newPost.save();

		res.status(201).json(newPost);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const getPost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		res.status(200).json(post);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const deletePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}
		if (post.postedBy.toString() !== req.user._id.toString()) {
			res
				.status(401)
				.json({ error: "You are not authorized to delete this post" });
		}
		if (post.image) {
			const imageId = post.image.split("/").pop().split(".")[0];
			await cloudinary.uploader.upload.destroy(imageId);
		}
		await Post.findByIdAndDelete(req.params.id);

		res.status(200).json({ message: "Post deleted successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const likeUnlikePost = async (req, res) => {
	try {
		const { id: postId } = req.params;
		const userId = req.user._id;
		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ error: "Post not found." });
		}

		const postLikedByUser = post.likes.includes(userId);
		if (postLikedByUser) {
			await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
			res.status(200).json({ message: "Post removed from liked posts" });
		} else {
			post.likes.push(userId);
			await post.save();
			res.status(200).json({ message: "Post liked" });
		}
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const replyToPost = async (req, res) => {
	try {
		const { text } = req.body;
		const postId = req.params.id;
		const userId = req.user._id;
		const userProfilePic = req.user.profilePic;
		const username = req.user.username;

		if (!text) {
			return res.status(400).json({ error: "Reply cannot be empty." });
		}

		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const reply = { userId, text, userProfilePic, username };
		post.replies.push(reply);
		await post.save();

		res.status(200).json(reply);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const repostPost = async (req, res) => {
	try {
		const postId = req.params.id;
		const userId = req.user._id;

		const originalPost = await Post.findById(postId).populate("postedBy");
		if (!originalPost) {
			return res.status(404).json({ error: "Post not found" });
		}

		const newRepost = new Repost({
			post: originalPost._id,
			repostedBy: userId,
		});

		await newRepost.save();

		const repostedPost = await Post.findById(originalPost._id)
			.populate("postedBy")
			.exec();

		res.status(201).json({
			...repostedPost.toObject(),
			isRepost: true,
			repostedBy: userId,
		});
		// const response = {
		// 	_id: newRepost._id,
		// 	post: {
		// 		_id: originalPost._id,
		// 		content: originalPost.content,
		// 		postedBy: originalPost.postedBy,

		// 	},
		// 	repostedBy: newRepost.repostedBy,
		// 	isRepost: true,
		// 	createdAt: newRepost.createdAt,
		// 	updatedAt: newRepost.updatedAt,
		// };
		// res.status(201).json(response);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const getFeedPosts = async (req, res) => {
	try {
		const userId = req.user._id;
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}
		const followingNotFrozen = await User.find({
			_id: { $in: user.following },
			isFrozen: false,
		}).select("_id");
		const followingIds = followingNotFrozen.map(
			(followingUser) => followingUser._id
		);

		const originalPosts = await Post.find({
			postedBy: { $in: followingIds },
		})
			.populate("postedBy", "_id username name profilePicture")
			.sort({ createdAt: -1 });

		const reposts = await Repost.find({
			repostedBy: { $in: followingIds },
		})
			.populate({
				path: "post",
				populate: {
					path: "postedBy",
					select: "_id username name profilePicture",
				},
			})
			.populate({
				path: "repostedBy",
				select: "_id username name profilePicture",
			})
			.sort({ createdAt: -1 });

		const feedPosts = [
			...originalPosts
				.filter((post) => post.postedBy._id.toString() !== userId.toString())
				.map((post) => ({
					...post.toObject(),
					isRepost: false,
					postedBy: post.postedBy,
				})),
			...reposts
				.filter(
					(repost) => repost.repostedBy._id.toString() !== userId.toString()
				)
				.map((repost) => ({
					...repost.post.toObject(),
					isRepost: true,
					repostedBy: repost.repostedBy,
					postedBy: repost.post.postedBy,
				})),
		];

		feedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
		res.status(200).json(feedPosts);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const getUserPosts = async (req, res) => {
	const  username  = req.params.username;

	try {
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const originalPosts = await Post.find({ postedBy: user._id }).populate("postedBy", "_id username name profilePicture").sort({
			createdAt: -1,
		});

		const reposts = await Repost.find({ repostedBy: user._id })
			.populate({
				path: "post",
				populate: {
					path: "postedBy",
					select: "_id username name profilePicture",
				},
			})
			.populate({
				path: "repostedBy",
				select: "_id username name profilePicture",
			})
			.sort({ createdAt: -1 });

		const combinedPosts = [
			...originalPosts.map((post) => ({
				...post.toObject(),
				isRepost: false,
				postedBy: post.postedBy,
			})),
			...reposts.map((repost) => ({
				...repost.post.toObject(),
				isRepost: true,
				repostedBy: repost.repostedBy,
				postedBy: repost.post.postedBy,
			})),
		].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

		res.status(200).json(combinedPosts);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export {
	createPost,
	deletePost,
	getPost,
	likeUnlikePost,
	replyToPost,
	getFeedPosts,
	getUserPosts,
	repostPost,
};
