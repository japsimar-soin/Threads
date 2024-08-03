import { useState } from "react";
import useShowToast from "./useShowToast";

const usePreviewImage = () => {
	const [image, setImage] = useState(null);
	const showToast = useShowToast();
	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file && file.type.startsWith("image/")) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setImage(reader.result);
			};
			reader.readAsDataURL(file);
		} else {
			showToast("Invalid file type", "Select an image file", "error");
			setImage(null);
		}
	};
	return { handleImageChange, image };
};

export default usePreviewImage;
