import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import {
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
} from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/follow/:id", protectRoute, followUnfollowUser);
router.get("/profile/:query", protectRoute, getUser);
router.get("/saved", protectRoute, getSavedPosts);
router.get("/suggested", protectRoute, getSuggestedUsers);
router.put("/update/:id", protectRoute, updateUser);
router.put("/freeze", protectRoute, freezeUserAccount);
router.put("/save/:postId", protectRoute, saveUnsavePost);

export default router;
