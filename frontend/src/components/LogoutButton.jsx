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
			onClick={logout}
			bg={useColorModeValue("gray.300", "gray.darkest")}
			_hover={{ bg: useColorModeValue("gray.400", "gray.mid") }}
			display={{ base: "none", md: "block" }}
		>
			<FiLogOut size={16} />
		</Button>
	);
};

export default LogoutButton;
