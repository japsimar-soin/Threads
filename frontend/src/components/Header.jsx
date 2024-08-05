import { Flex, Image, Link, useColorMode } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { GoHome } from "react-icons/go";
import { RxAvatar } from "react-icons/rx";
import { Link as RouterLink } from "react-router-dom";
import userAtom from "../atoms/userAtom";

const Header = () => {
	const { colorMode, toggleColorMode } = useColorMode();
	const user = useRecoilValue(userAtom);
	
	return (
		<Flex justifyContent={user? "space-between" : "center"} mt="6" mb="12">
			{user && (
				<Link as={RouterLink} to="/">
					<GoHome size={24} />
				</Link>
			)}

			<Image
				cursor={"pointer"}
				alt="logo"
				w={6}
				src={colorMode == "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
				onClick={toggleColorMode}
			/>
			{user && (
				<Link as={RouterLink} to={`/${user.username}`}>
					<RxAvatar size={24} />{" "}
				</Link>
			)}
		</Flex>
	);


};

export default Header;


