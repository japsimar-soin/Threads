import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import Repost from "../models/repostModel.js";
import generateToken from "../utils/generateToken.js";
import { v2 as cloudinary } from "cloudinary";

const getUser = async (req, res) => {
	const query  = req.params.query;
	try {
		let user;
		// console.log(query);
		if (mongoose.Types.ObjectId.isValid(query)) {
			user = await User.findOne({ _id: query })
				.select("-password")
				.select("-updatedAt");
		} else {
			user = await User.findOne({ username: query })
				.select("-password")
				.select("-updatedAt");
		}
		// console.log(user);
		if (!user) {
			console.log("User not found:", query); // Debug log for user not found
			return res.status(404).json({ error: "User not found." });
		}
		console.log("User found:", user); // Debug log for successful user fetch
		res.status(200).json(user);
	} catch (error) {
		console.log("Error while trying to get user profile : ", error.message);
		res.status(500).json({ error: error.message });
	}
};

const signupUser = async (req, res) => {
	try {
		const { name, email, username, password } = req.body;
		const user = await User.findOne({ $or: [{ email }, { username }] });
		if (user) {
			return res.status(400).json({
				error:
					"User with same username or email already exists. Try logging in.",
			});
		}
		const salt = await bcrypt.genSalt(10);
		const hashPassword = await bcrypt.hash(password, salt);

		const newUser = new User({ name, email, username, password: hashPassword });
		await newUser.save();

		if (newUser) {
			generateToken(newUser._id, res);
			res.status(201).json({
				_id: newUser._id,
				name: newUser.name,
				email: newUser.email,
				username: newUser.username,
				bio: newUser.bio,
				profilePic: newUser.profilePic,
			});
		} else {
			res.status(400).json({ error: "Invalid or incomplete credentials" });
		}
	} catch (error) {
		res.status(500).json({ error: error.message });
		console.log("Error while signing up : ", error.message);
	}
};

const loginUser = async (req, res) => {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({ username });
		const isPasswordCorrect = await bcrypt.compare(
			password,
			user?.password || ""
		); //incase a user doesn't exist, it tries to compare it with empty string instead of null or undefined value to avoid error
		if (!user || !isPasswordCorrect) {
			return res.status(400).json({ error: "Invalid credentials" });
		}

		if (user.isFrozen) {
			user.isFrozen = false;
			await user.save();
		}

		generateToken(user._id, res);
		res.status(200).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			username: user.username,
			bio: user.bio,
			profilePic: user.profilePic,
			message: "User logged in successfully",
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
		console.log("Error while logging in : ", error.message);
	}
};

const logoutUser = async (req, res) => {
	try {
		res.clearCookie("token", { path: "/" });
		res.status(200).json({ message: "User logged out successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
		console.log("Error while logging out : ", error.message);
	}
};

const followUnfollowUser = async (req, res) => {
	try {
		const { id } = req.params;
		const userToFollowOrUnfollow = await User.findById(id);
		const currentUser = await User.findById(req.user._id);
		if (id === req.user._id.toString()) {
			return res
				.status(400)
				.json({ error: "You cannot follow/unfollow yourself." });
		}
		if (!userToFollowOrUnfollow || !currentUser) {
			return res.status(400).json({ error: "User not found" });
		}
		const isFollowing = currentUser.following.includes(id);
		if (isFollowing) {
			await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } }); //remove id of userToFollowOrUnfollow from following array of currentUser
			await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } }); //remove id of currentUser from followers array of userToFollowOrUnfollow
			res.status(200).json({ message: "User unfollowed successfully" });
		} else {
			await User.findByIdAndUpdate(req.user._id, { $push: { following: id } }); //remove id of userToFollowOrUnfollow from following array of currentUser
			await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } }); //remove id of currentUser from followers array of userToFollowOrUnfollow
			res.status(200).json({ message: "User followed successfully" });
		}
	} catch (error) {
		res.status(500).json({ error: error.message });
		console.log("Error while trying to follow/unfollow user : ", error.message);
	}
};

const updateUser = async (req, res) => {
	const { name, email, username, password, bio } = req.body;
	let { profilePic } = req.body;
	const userId = req.user._id;
	try {
		let user = await User.findById(userId);
		if (!user) {
			return res.status(400).json({ error: "User not found" });
		}
		if (req.params.id !== userId.toString()) {
			return res
				.status(400)
				.json({ error: "Cannot update profile of other users" });
		}
		if (password) {
			const salt = await bcrypt.genSalt(10);
			const hashPassword = await bcrypt.hash(password, salt);
			user.password = hashPassword;
		}
		if (profilePic) {
			if (user.profilePic) {
				await cloudinary.uploader.destroy(
					user.profilePic.split("/").pop().split(".")[0]
				);
			}
			const uploadedResponse = await cloudinary.uploader.upload(profilePic);
			profilePic = uploadedResponse.secure_url;
		}

		user.name = name || user.name;
		user.email = email || user.email;
		user.username = username || user.username;
		user.profilePic = profilePic || user.profilePic;
		user.bio = bio || user.bio;

		user = await user.save();

		await Post.updateMany(
			{ "replies.userId": userId },
			{
				$set: {
					"replies.$[reply].username": user.username,
					"replies.$[reply].userProfilePic": user.profilePic,
				},
			},
			{
				arrayFilters: [{ "reply.userId": userId }],
			}
		);
		user.password = null;
		res.status(200).json(user);
	} catch (error) {
		res.status(500).json({ error: error.message });
		console.log("Error while trying to update user : ", error.message);
	}
};

const getSuggestedUsers = async (req, res) => {
	try {
		const userId = req.user._id;
		const usersYouFollow = await User.findById(userId).select("following");
		const users = await User.aggregate([
			{
				$match: {
					_id: { $ne: userId },
				},
			},
			{
				$sample: { size: 10 },
			},
		]);

		const filteredUsers = users.filter(
			(user) => !usersYouFollow.following.includes(user._id)
		);
		const suggestedUsers = filteredUsers.slice(0, 4);

		suggestedUsers.forEach((user) => (user.password = null));
		res.status(200).json(suggestedUsers);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const freezeUserAccount = async (req, res) => {
	try {
		const user = await User.findById(req.user._id);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}
		user.isFrozen = true;
		await user.save();
		res.status(200).json({ success: true });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const saveUnsavePost = async (req, res) => {
	try {
		const userId = req.user._id;
		const { postId } = req.params;

		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const post = await Post.findById(postId);
		if (!post) {
			const repost = await Repost.findById(postId).populate("post");
			if (!repost) {
				return res.status(404).json({ message: "Post or repost not found" });
			}
			// Use the original post
			post = repost.post;
		}

		const isPostSaved = user.savedPosts.some(
			(savedPost) => savedPost._id.toString() === post._id.toString()
		);
		if (isPostSaved) {
			user.savedPosts = user.savedPosts.filter(
				(savedPost) => savedPost._id.toString() !== post._id.toString()
			);
			await user.save();
			return res.status(200).json({
				message: "Post removed from saved posts",
				isSaved: !isPostSaved,
			});
		} else {
			user.savedPosts.push(post);
			await user.save();
			return res
				.status(200)
				.json({ message: "Post saved", isSaved: !isPostSaved });
		}
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const getSavedPosts = async (req, res) => {
	try {
		const userId = req.user._id;
		const user = await User.findById(userId).populate({
			path: "savedPosts",
			populate: {
				path: "postedBy",
				select: "_id username name profilePicture",
			},
		});
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}
		res.status(200).json(user.savedPosts);
	} catch (error) {
		console.error("Error fetching saved posts:", error);
		res.status(500).json({ error: "Server error" });
	}
};

export {
	signupUser,
	loginUser,
	logoutUser,
	followUnfollowUser,
	updateUser,
	getUser,
	getSuggestedUsers,
	freezeUserAccount,
	saveUnsavePost,
	getSavedPosts,
};
