import { Button, Text } from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";
import useLogout from "../hooks/useLogout";

const SettingsPage = () => {
	const showToast = useShowToast();
	const logout = useLogout();
	const freezeAccount = async () => {
		if (!window.confirm("are you sure you want to freeze your account?"))
			return;
		try {
			const res = await fetch("/api/users/freeze", {
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
			if (data.success) {
				await logout();
				showToast("Success", "Your account has been frozen", "success");
			}
		} catch (error) {
			showToast("Error", error.message, "error");
		}
	};
	return (
		<>
			<Text my={1} mb={4} fontWeight={"bold"}>
				Freeze your account
			</Text>
			<Text my={1} mb={2}>
				You can unfreeze your account anytime by logging in.
			</Text>
			<Button mt={3} size={"sm"} colorScheme="red" onClick={freezeAccount}>
				Freeze
			</Button>
		</>
	);
};

export default SettingsPage;
