import { useCallback } from "react";
import useShowToast from "./useShowToast";

const useShare = () => {
	const showToast = useShowToast();

	const shareContent = useCallback(
		async (url, title) => {
			if (navigator.share) {
				try {
					await navigator.share({
						title,
						url,
					});
					showToast("Success", "Content shared successfully", "success");
				} catch (error) {
					showToast("Error", "Could not share content", "error");
				}
			} else {
				showToast(
					"Error",
					"Share feature not supported on this device",
					"error"
				);
				alert("Share feature not supported on this device");
			}
		},
		[showToast]
	);

	const sharePost = (post) => {
		const url = `${window.location.origin}/${post.username}/post/${post._id}`;
		const title = post.text || "Check out this post!";
		shareContent(url, title);
	};

	const shareProfile = (username) => {
		const url = `${window.location.origin}/${username}`;
		const title = `Check out ${username}'s profile!`;
		shareContent(url, title);
	};

	return { sharePost, shareProfile };
};

export default useShare;
