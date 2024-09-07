import {
	Box,
	Menu,
	MenuButton,
	Portal,
	MenuList,
	MenuItem,
	useColorMode,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { RxAvatar } from "react-icons/rx";
import { CiMenuBurger } from "react-icons/ci";
import { BsChatDots } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { IoAddOutline, IoSettingsOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useLogout from "../hooks/useLogout";
import CreatePost from "./CreatePost";

const MenuOptions = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { colorMode } = useColorMode();
	const navigate = useNavigate();
	const user = useRecoilValue(userAtom);

	const handleLogout = useLogout();

	const handlePost = () => {
		onOpen();
	};

	const handleChat = () => {
		navigate("/chat");
	};

	const handleProfile = () => {
		if (user && user.username) {
			navigate(`/${user.username}`);
		}
	};

	const handleSettings = () => {
		navigate("/settings");
	};

	return (
		<Box
			className="icon-container"
			borderRadius="50%"
			p="10px"
			w="40px"
			h="40px"
			transition="background-color 0.3s ease-in-out"
			_hover={{
				bg: colorMode === "light" ? "gray.verylight" : "gray.darker",
			}}
		>
			<Menu>
				<MenuButton>
					<CiMenuBurger size={20} cursor={"pointer"} />
				</MenuButton>
				<Portal>
					<MenuList
						bg={colorMode === "light" ? "gray.lightest" : "gray.darkest"}
					>
						<MenuItem
							icon={<IoAddOutline size={20} />}
							bg={colorMode === "light" ? "gray.lightest" : "gray.darkest"}
							_hover={{
								bg: colorMode === "light" ? "gray.verylight" : "gray.darker",
							}}
							onClick={handlePost}
						>
							Create Post
						</MenuItem>
						<MenuItem
							icon={<BsChatDots size={20} />}
							bg={colorMode === "light" ? "gray.lightest" : "gray.darkest"}
							_hover={{
								bg: colorMode === "light" ? "gray.verylight" : "gray.darker",
							}}
							onClick={handleChat}
						>
							Chats
						</MenuItem>
						<MenuItem
							icon={<RxAvatar size={20} />}
							bg={colorMode === "light" ? "gray.lightest" : "gray.darkest"}
							_hover={{
								bg: colorMode === "light" ? "gray.verylight" : "gray.darker",
							}}
							onClick={handleProfile}
						>
							Profile
						</MenuItem>
						<MenuItem
							icon={<IoSettingsOutline size={20} />}
							bg={colorMode === "light" ? "gray.lightest" : "gray.darkest"}
							_hover={{
								bg: colorMode === "light" ? "gray.verylight" : "gray.darker",
							}}
							onClick={handleSettings}
						>
							Settings
						</MenuItem>
						<MenuItem
							icon={<FiLogOut size={20} />}
							bg={colorMode === "light" ? "gray.lightest" : "gray.darkest"}
							_hover={{
								bg: colorMode === "light" ? "gray.verylight" : "gray.darker",
							}}
							onClick={handleLogout}
						>
							Logout
						</MenuItem>
					</MenuList>
				</Portal>
			</Menu>
			<CreatePost isOpen={isOpen} onClose={onClose} />
		</Box>
	);
};

export default MenuOptions;
