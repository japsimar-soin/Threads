import { useEffect, useState } from "react";
import { formatDistanceToNowStrict } from "date-fns";

const getInitials = (timeAgo) => {
	return timeAgo
		.replace(/ years?/, "y")
		.replace(/ months?/, "mo")
		.replace(/ weeks?/, "w")
		.replace(/ days?/, "d")
		.replace(/ hours?/, "h")
		.replace(/ minutes?/, "m")
		.replace(/ seconds?/, "s");
};

const useGetPostCreationTime = (timestamp) => {
	const [timeAgo, setTimeAgo] = useState("");

	useEffect(() => {
		const parseTimestamp = (ts) => {
			if (typeof ts === "string") {
				return new Date(ts);
			} else if (typeof ts === "number") {
				return new Date(ts);
			}
			return new Date();
		};

		const getTimeAgo = () => {
			const date = parseTimestamp(timestamp);

			if (isNaN(date.getTime())) {
				console.error("Invalid date:", timestamp);
				return "Invalid date";
			}

			const timeDifference = formatDistanceToNowStrict(date);
			return getInitials(timeDifference);
		};

		setTimeAgo(getTimeAgo());

		const intervalId = setInterval(() => {
			setTimeAgo(getTimeAgo());
		}, 60000);

		return () => clearInterval(intervalId);
	}, [timestamp]);

	return timeAgo;
};

export default useGetPostCreationTime;
