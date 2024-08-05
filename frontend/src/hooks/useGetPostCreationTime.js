import { formatDistanceToNow } from "date-fns";
import { useMemo } from "react";

const useGetPostCreationTime = (createdAt) => {
	const extractNumericValueAndUnit = (distanceString) => {
		const match = distanceString.match(/(\d+)\s+(\w+)/);
		if (match) {
			const numericValue = parseInt(match[1], 10);
			let unit = match[2];
			const unitMap = {
				second: "s",
				seconds: "s",
				minute: "m",
				minutes: "m",
				hour: "h",
				hours: "h",
				day: "d",
				days: "d",
				week: "w",
				weeks: "w",
				month: "mo",
				months: "mo",
				year: "y",
				years: "y",
			};
			unit = unitMap[unit] || unit;
			return { numericValue, unit };
		}
		return null;
	};

	const result = useMemo(() => {
		const distanceString = formatDistanceToNow(new Date(createdAt));
		return extractNumericValueAndUnit(distanceString);
	}, [createdAt]);

	return result;
};

export default useGetPostCreationTime;
