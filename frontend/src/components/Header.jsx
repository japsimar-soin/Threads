import { Flex, Image, Link, useColorMode, Box } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { GoHome } from "react-icons/go";
import { Link as RouterLink } from "react-router-dom";
import userAtom from "../atoms/userAtom";
import MenuOptions from "./MenuOptions";

const Header = () => {
	const { colorMode, toggleColorMode } = useColorMode();
	const user = useRecoilValue(userAtom);

	return (
		<Box position="fixed" top="0" left="0" width="100%" zIndex={2}>
			<Flex
				maxW={{ base: "620px", md: "800px" }}
				mx="auto"
				px={4}
				justifyContent={"space-between"}
				alignItems="center"
				height="60px"
			>
				{user && (
					<Box
						className="icon-container"
						borderRadius="50%"
						p="8px"
						w="40px"
						h="40px"
						transition="background-color 0.3s ease-in-out"
						_hover={{
							bg: colorMode === "light" ? "gray.verylight" : "gray.darker",
						}}
					>
						<Link
							as={RouterLink}
							display={"block"}
							position={"static"}
							left={{ base: 0 }}
							to="/"
						>
							<GoHome fontWeight={"bold"} size={24} />
						</Link>
					</Box>
				)}

				<Image
					cursor={"pointer"}
					alt="logo"
					w={6}
					src={colorMode == "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
					onClick={toggleColorMode}
					position="absolute"
					left="50%"
					transform="translateX(-50%)"
				/>

				{user ? (
					<Flex alignItems={"center"} justifyContent={"center"} mb={4}>
						<MenuOptions />
					</Flex>
				) : null}
			</Flex>
		</Box>
	);
};

export default Header;
