// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import useShowToast from "./useShowToast";

// const useGetUserProfile = () => {
// 	const [user, setUser] = useState(null);
// 	const [loading, setLoading] = useState(true);
// 	const { username } = useParams();
// 	const showToast = useShowToast();

// 	useEffect(() => {
// 		const getUser = async () => {
// 			if (!username) {
// 				console.warn("Username is undefined or empty");
// 				// setLoading(false); // No need to fetch if username is not available
// 				return;
// 			}

// 			try {
// 				console.log("Fetching user with username:", username);
// 				const res = await fetch(`/api/users/profile/${username}`);

// 				const data = await res.json();
// 				console.log("API response:", data);
// 				if (data.error) {
// 					showToast("Error", data.error, "error");
// 					// setUser(null);
// 					return;
// 				}

// 				if (data.isFrozen) {
// 					setUser(null);
// 					return;
// 				}

// 				setUser(data);
// 			} catch (error) {
// 				console.error("Fetch error:", error.message);
// 				showToast("Error", error.message, "error");
// 				// setUser(null);
// 			} finally {

// 				setLoading(false);
// 			}
// 		};

// 		getUser();
// 	}, [username, showToast]);

// 	return { loading, user };
// };

// export default useGetUserProfile;

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useShowToast from "./useShowToast";

const useGetUserProfile = () => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const { username } = useParams(); // Extract username from URL parameters
	const showToast = useShowToast();
// const username= "jane";
	useEffect(() => {
		console.log(username);
		
		if (!username) {
			console.error("Username is undefined");
			setLoading(false); // End loading state if username is missing
			return;
		}
		const getUser = async () => {

			try {
				// console.log(username);
				const res = await fetch(`/api/users/profile/${username}`);
				// console.log(res);
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					// setUser(null); // Set user to null on error
					return;
				}

				if (data.isFrozen) {
					setUser(null);
					return;
				}
				// console.log(data);
				setUser(data);
			} catch (error) {
				showToast("Error", error.message, "error");
			} finally {
				setLoading(false); // Ensure loading state ends
			}
		};

		getUser();
	}, [username, showToast]);

	return { loading, user };
};

export default useGetUserProfile;
