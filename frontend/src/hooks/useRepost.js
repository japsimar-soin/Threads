import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "./useShowToast";

const useRepost = () => {
	const user = useRecoilValue(userAtom);
	const showToast = useShowToast();

	const repostPost = async (postId) => {
		if (!user) {
			showToast("Error", "Login first", "error");
			return;
		}

		try {
			const res = await fetch(`/api/repost/${postId}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ userId: user._id }),
			});

			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}

			return { data };
		} catch (error) {
			showToast("Error", error, "error");
			return;
		}
	};

	return { repostPost };
};

export default useRepost;
