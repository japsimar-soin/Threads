import { useCallback } from "react";
import useShowToast from "./useShowToast";

const useReport = (postId, currentUser) => {
	const showToast = useShowToast();

	const handleReport = useCallback(
		async (reason) => {
			try {
				const res = await fetch("/api/reports/report", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						postId,
						reason,
						reportedBy: currentUser._id,
					}),
				});

				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
          return;
				} else {
					showToast("Success", "Post reported successfully", "success");
				}
			} catch (error) {
				showToast("Error", error.message, "error");
			}
		},
		[postId, currentUser, showToast]
	);

	return handleReport;
};

export default useReport;
