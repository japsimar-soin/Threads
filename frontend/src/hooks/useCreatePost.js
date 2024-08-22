import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useNavigate, useParams } from "react-router-dom";
import postAtom from "../atoms/postAtom";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";

const useCreatePost = () => {
	const [loading, setLoading] = useState(false);
	const [posts, setPosts] = useRecoilState(postAtom);
	const user = useRecoilValue(userAtom);
	const showToast = useShowToast();
	const navigate = useNavigate();
	const { username } = useParams();

	const createPost = async (
		postText,
		image,
		onClose,
		setPostText,
		setImage
	) => {
		setLoading(true);

		try {
			const res = await fetch(`/api/posts/create`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					postedBy: user._id,
					text: postText,
					image: image,
				}),
			});

			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}

			showToast("Success", "Post created", "success");

			if (username === user.username) {
				setPosts([data, ...posts]);
			}
			onClose();
			setPostText("");
			setImage("");

			navigate("/");
		} catch (error) {
			showToast("Error", error.message, "error");
		} finally {
			setLoading(false);
		}
	};

	return { createPost, loading };
};

export default useCreatePost;
