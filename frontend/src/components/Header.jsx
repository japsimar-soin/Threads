import {
	Flex,
	Image,
	Link,
	useColorMode,
	IconButton,
	Icon,
} from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { GoHome } from "react-icons/go";
import { RxAvatar } from "react-icons/rx";
import { TbMenu2 } from "react-icons/tb";
import { BsChatDots } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";
import { Link as RouterLink } from "react-router-dom";
import userAtom from "../atoms/userAtom";
// import authAtom from "../atoms/authAtom";

const Header = () => {
	const { colorMode, toggleColorMode } = useColorMode();
	const user = useRecoilValue(userAtom);
	// const setAuthScreen = useSetRecoilState(authAtom);

	return (
		<Flex
			// justifyContent={user ? "space-between" : "center"}
			justifyContent={"space-between"}
			alignItems="center"
			mt="6"
			mb="12"
			position="relative"
		>
			{user && (
				<Link
					as={RouterLink}
					display={{ base: "none", md: "block" }}
					position={{ base: "absolute", md: "static" }}
					left={{ base: 0 }}
					to="/"
				>
					<GoHome size={24} />
				</Link>
			)}
			{/* {!user && (
				<Link
					as={RouterLink}
					display={{ base: "none", md: "block" }}
					position={{ base: "absolute", md: "static" }}
					left={{ base: 0 }}
					onClick={() => setAuthScreen("login")}
				>
					Login
				</Link>
			)} */}
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
				<IconButton
					bg={"transparent"}
					aria-label="Open Menu"
					icon={<Icon as={TbMenu2} size={"xs"} />}
					display={{ base: "block", md: "none" }}
					position={{ base: "absolute", md: "static" }}
					right={{ base: 0 }}
					size={"md"}
					// top="30px"
					// onClick={handleMenuOpen} // Replace with your menu open function
				/>
			) : null}
			{user && (
				<Flex flexDirection={"column"} gap={2}>
					<Link
						as={RouterLink}
						to={`/${user.username}`}
						display={{ base: "none", md: "block" }}
						position={{ base: "absolute", md: "static" }}
						right={{ base: 0 }}
					>
						<RxAvatar size={24} />
					</Link>
					<Link
						as={RouterLink}
						to={`/chat`}
						display={{ base: "none", md: "block" }}
						position={{ base: "absolute", md: "static" }}
						right={{ base: 0 }}
					>
						<BsChatDots size={24} />
					</Link>
					<Link
						as={RouterLink}
						to={`/settings`}
						display={{ base: "none", md: "block" }}
						position={{ base: "absolute", md: "static" }}
						right={{ base: 0 }}
					>
						<IoSettingsOutline size={24} />
					</Link>
				</Flex>
			)}
			{!user && (
				<IconButton
					bg={"transparent"}
					aria-label="Open Menu"
					icon={<Icon as={TbMenu2} size={20} />}
					// display={{ base: "block", md: "none" }}
					position={"absolute"}
					right={{ base: 0 }}
					// size={"lg"}
					// top="30px"
					// onClick={handleMenuOpen} // Replace with your menu open function
				/>
			)}
			{/* {user && (
					<Link
						as={RouterLink}
						display={{ base: "none", md: "block" }}
						position={{ base: "absolute", md: "static" }}
						right={{ base: 0 }}
						to={`/${user.username}`}
					>
						<RxAvatar size={24} />{" "}
						<TbMenu2 />
					</Link>
				)} */}
			{/* {!user && (
				<Link
					as={RouterLink}
					display={{ base: "none", md: "block" }}
					// position={{ base: "absolute", md: "static" }}
					// right={{ base: 0 }}
					onClick={() => setAuthScreen("signup")}
				>
					Sign up
				</Link>
			)} */}
		</Flex>
	);
};

export default Header;
