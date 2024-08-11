import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const protectRoute = async (req, res, next) => {
	try {
		const token = req.cookies.token;
		if (!token) {
			return res.status(401).json({ error: "Unauthorized user" });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(decoded.userId).select("-password"); //userId is the payload used for token generation and it sends without the password for safety
		req.user = user;

		next();
	} catch (error) {
		res.status(500).json({ error: error.message });
		console.log("Error : ", error.message);
	}
};

export default protectRoute;
