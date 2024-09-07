import { Button, useColorModeValue } from "@chakra-ui/react";
import { FiLogOut } from "react-icons/fi";
import useLogout from "../hooks/useLogout";

const LogoutButton = () => {
	const logout = useLogout();

	return (
		<Button
			position={"fixed"}
			top={"30px"}
			right={4}
			size={"sm"}
			bg={useColorModeValue("gray.lightest", "gray.darkest")}
			_hover={{ bg: useColorModeValue("gray.verylight", "gray.mid") }}
			display={{ base: "none", md: "block" }}
			cursor={"pointer"}
			onClick={() => {
				console.log("Button clicked");
				logout();
			}}
			zIndex={10}
		>
			<FiLogOut size={16} />
		</Button>
	);
};

export default LogoutButton;
