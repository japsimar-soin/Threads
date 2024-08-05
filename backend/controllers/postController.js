import Post from "../models/postModel.js";
import User from "../models/userModel.js";
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
			return res.status(400).json({ error: "User not found" });
		}
		if (user._id.toString() !== req.user._id.toString()) {
			return res.status(400).json({ error: "Not authorized" });
		}
		const maxLen = 500;
		if (text.length > maxLen) {
			return res
				.status(400)
				.json({ error: `Text must be less than ${maxLen} characters.` });
		}
		if (image) {
			const uploadedPost = await cloudinary.uploader.upload(image);
			image = uploadedPost.secure_url;
		}
		const newPost = new Post({ postedBy, text, image });
		await newPost.save();
		res.status(201).json({ message: "Post created successfully", newPost });
	} catch (error) {
		res.status(500).json({ error: error.message });
		console.log(error);
	}
};

const getPost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}
		res.status(200).json( post );
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
		if(post.image){
			const imageId = post.image.split("/").pop().split(".")[0];
			await cloudinary.uploader.upload.destroy(imageId);
		}
		await Post.findByIdAndDelete(req.params.id);
		res.status(200).json({ message: "Post deleted successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
		console.log(error);
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
			res.status(404).json({ error: "Post not found" });
		}
		const reply = { userId, text, userProfilePic, username };
		post.replies.push(reply);
		await post.save();
		res.status(200).json({ message: "Replied to post successfully", post });
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
		const following = user.following;
		const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({
			createdAt: -1,
		});
		res.status(200).json(feedPosts);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const getUserPosts = async (req, res) => {
	const { username } = req.params;

	try {
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}
		const posts = await Post.find({ postedBy: user._id }).sort({
			createdAt: -1,
		});
		res.status(200).json(posts);
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
};
