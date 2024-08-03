import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/helpers/generateToken.js";
import { v2 as cloudinary } from "cloudinary";

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
			const hashPassword = bcrypt.hash(password, salt);
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
		user.password = null;
		res.status(200).json(user);
	} catch (error) {
		res.status(500).json({ error: error.message });
		console.log("Error while trying to update user : ", error.message);
	}
};

const getUserProfile = async (req, res) => {
	const { username } = req.params;
	try {
		const user = await User.findOne({ username })
			.select("-password")
			.select("-updatedAt");
		if (!user) {
			return res.status(400).json({ error: "User not found." });
		}
		res.status(200).json(user);
	} catch (error) {
		res.status(500).json({ error: error.message });
		console.log("Error while trying to get user profile : ", error.message);
	}
};

export {
	signupUser,
	loginUser,
	logoutUser,
	followUnfollowUser,
	updateUser,
	getUserProfile,
};
