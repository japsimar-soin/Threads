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
} from "../controllers/userController.js";

const router = express.Router();

router.get("/profile/:query", getUser);
router.get("/suggested", protectRoute, getSuggestedUsers);
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/follow/:id", protectRoute, followUnfollowUser);
router.put("/update/:id", protectRoute, updateUser);
router.put("/freeze", protectRoute, freezeUserAccount);

export default router;
