import { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "./useShowToast";

const useSaveUnsave = (postId) => {
	const currentUser = useRecoilValue(userAtom);
	const showToast = useShowToast();
	const [saving, setSaving] = useState(false);
	const [saved, setSaved] = useState(false);

	useEffect(() => {
		const checkIfSaved = async () => {
			try {
				if (!currentUser) return;

				const res = await fetch("/api/users/saved");

				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}

				setSaved(data.some((post) => post._id === postId));
			} catch (error) {
				showToast("Error", error.message, "error");
			}
		};

		checkIfSaved();
	}, [postId, currentUser, showToast]);

	const handleSaveUnsave = async () => {
		if (!currentUser) {
			showToast("Error", "Login first", "error");
			return;
		}

		if (saving) return;

		setSaving(true);

		try {
			const res = await fetch(`/api/users/save/${postId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
			});

			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}

			setSaved(data.isSaved);

			showToast(
				"Success",
				data.isSaved ? "Post saved!" : "Post unsaved!",
				"success"
			);
		} catch (error) {
			showToast("Error", error.message, "error");
		} finally {
			setSaving(false);
		}
	};

	return { handleSaveUnsave, saving, saved };
};

export default useSaveUnsave;
