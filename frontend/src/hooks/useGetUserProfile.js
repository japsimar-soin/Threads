import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useShowToast from "./useShowToast";

const useGetUserProfile = () => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const { username } = useParams();
	const showToast = useShowToast();

	useEffect(() => {
		if (!username) {
			console.error("Username is undefined");
			setLoading(false);
			return;
		}

		const getUser = async () => {
			try {
				const res = await fetch(`/api/users/profile/${username}`);
				const data = await res.json();
				if (data.error) {
					// showToast("Error", data.error, "error");
					console.log("getUserProfile Hook -data error");

					return;
				}

				if (data.isFrozen) {
					setUser(null);
					return;
				}

				setUser(data);
			} catch (error) {
				// showToast("Error", error.message, "error");
				console.log("getUserProfile Hook");
			} finally {
				setLoading(false);
			}
		};

		getUser();
	}, [username, showToast]);

	return { loading, user };
};

export default useGetUserProfile;
