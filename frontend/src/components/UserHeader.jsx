import {
	Box,
	Flex,
	Link,
	Text,
	VStack,
	Avatar,
	Button,
	Divider,
	useColorMode,
} from "@chakra-ui/react";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/menu";
import { Portal } from "@chakra-ui/portal";
import { useRecoilValue } from "recoil";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { BsInstagram, BsSave } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import {
	IoSettingsOutline,
	IoCopyOutline,
	IoShareSocial,
} from "react-icons/io5";
import userAtom from "../atoms/userAtom";
import useShare from "../hooks/useShare";
import useShowToast from "../hooks/useShowToast";
import useFollowUnfollow from "../hooks/useFollowUnfollow";

const UserHeader = ({ user }) => {
	const showToast = useShowToast();
	const currentUser = useRecoilValue(userAtom);
	const navigate = useNavigate();
	const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);
	const { shareProfile } = useShare();
	const { colorMode } = useColorMode();

	const handleCopyProfile = () => {
		const currentURL = window.location.href;
		navigator.clipboard.writeText(currentURL).then(() => {
			showToast("Success", "URL copied to clipboard", "success");
		});
	};

	const openSettings = () => {
		navigate("/settings");
	};

	const handleShareProfile = () => {
		shareProfile(user.username);
	};

	const showSavedPosts = () => {
		navigate("/saved");
	};

	return (
		<VStack gap={4} alignItems={"start"} mb={8}>
			<Flex justifyContent={"space-between"} w={"full"}>
				<Box>
					<Text fontSize={"2xl"} fontWeight={"bold"}>
						{user.name}
					</Text>
					<Text fontSize={"sm"}>{user.username}</Text>
				</Box>

				<Box>
					{user.profilePic && (
						<Avatar
							name={user.name}
							src={user.profilePic}
							size={{
								base: "lg",
								md: "2xl",
							}}
						/>
					)}

					{!user.profilePic && (
						<Avatar
							name={user.name}
							src="https://bit.ly/broken-link"
							size={{
								base: "lg",
								md: "2xl",
							}}
						/>
					)}
				</Box>
			</Flex>
			<Text>{user.bio}</Text>

			{currentUser?._id === user._id && (
				<Link as={RouterLink} to="/update">
					<Button
						size={"sm"}
						bg={colorMode === "light" ? "gray.lighter" : "gray.mid"}
					>
						Update profile
					</Button>
				</Link>
			)}

			{currentUser?._id !== user._id && (
				<Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>
					{following ? "Unfollow" : "Follow"}
				</Button>
			)}

			<Flex w={"full"} justifyContent={"space-between"}>
				<Flex gap={2} alignItems={"center"}>
					<Text color={"gray.light"}>{user.followers.length} followers</Text>
					<Box w={1} h={1} bg={"gray.light"} borderRadius={"full"} />
					<Text color={"gray.light"}>{user.following.length} following</Text>
				</Flex>

				<Flex>
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
						<Link href="https://www.instagram.com/" isExternal>
							<BsInstagram
								size={{
									base: "18",
									md: "24",
								}}
								cursor={"pointer"}
							/>
						</Link>
					</Box>

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
						onClick={(e) => e.preventDefault()}
					>
						<Menu>
							<MenuButton>
								<CgMoreO size={24} cursor={"pointer"} />
							</MenuButton>
							<Portal>
								<MenuList
									bg={colorMode === "light" ? "gray.lightest" : "gray.darkest"}
								>
									<MenuItem
										icon={<IoCopyOutline size={20} />}
										bg={
											colorMode === "light" ? "gray.lightest" : "gray.darkest"
										}
										_hover={{
											bg:
												colorMode === "light"
													? "gray.verylight"
													: "gray.darker",
										}}
										onClick={handleCopyProfile}
									>
										Copy Profile Link
									</MenuItem>
									<MenuItem
										icon={<IoShareSocial size={20} />}
										bg={
											colorMode === "light" ? "gray.lightest" : "gray.darkest"
										}
										_hover={{
											bg:
												colorMode === "light"
													? "gray.verylight"
													: "gray.darker",
										}}
										onClick={handleShareProfile}
									>
										Share Profile
									</MenuItem>
									{currentUser?._id === user._id && (
										<>
											<MenuItem
												icon={<BsSave size={20} />}
												bg={
													colorMode === "light"
														? "gray.lightest"
														: "gray.darkest"
												}
												_hover={{
													bg:
														colorMode === "light"
															? "gray.verylight"
															: "gray.darker",
												}}
												onClick={showSavedPosts}
											>
												Saved Posts
											</MenuItem>
											<MenuItem
												icon={<IoSettingsOutline size={20} />}
												bg={
													colorMode === "light"
														? "gray.lightest"
														: "gray.darkest"
												}
												_hover={{
													bg:
														colorMode === "light"
															? "gray.verylight"
															: "gray.darker",
												}}
												onClick={openSettings}
											>
												Settings
											</MenuItem>
										</>
									)}
								</MenuList>
							</Portal>
						</Menu>
					</Box>
				</Flex>
			</Flex>
			<Divider />
		</VStack>
	);
};

export default UserHeader;
