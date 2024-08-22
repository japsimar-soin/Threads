import {
	Box,
	Flex,
	Link,
	Text,
	VStack,
	Avatar,
	Button,
	Divider,
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

	const handleCopyProfile = () => {
		const currentURL = window.location.href;
		navigator.clipboard.writeText(currentURL).then(() => {
			showToast("Success", "URL copied to clipboard", "success");
		});
	};

	const handleShareProfile = () => {
		shareProfile(user.username);
	};

	const showSavedPosts =() =>{
		navigate("/saved");
	}

	return (
		<VStack gap={4} alignItems={"start"} mb={8}>
			<Flex justifyContent={"space-between"} w={"full"}>
				<Box>
					<Text fontSize={"2xl"} fontWeight={"bold"}>
						{user.name}
					</Text>
					<Flex gap={2} alignItems={"center"}>
						<Text fontSize={"sm"}>{user.username}</Text>
						<Text
							fontSize={"xs"}
							bg={"gray.darkest"}
							color={"gray.light"}
							p={1}
							borderRadius={"full"}
						>
							threads.net
						</Text>
					</Flex>
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
					<Button size={"sm"}>Update profile</Button>
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
					<Link color={"gray.light"}>instagram.com</Link>
				</Flex>

				<Flex>
					<Box className="icon-container">
						<BsInstagram
							size={{
								base: "18",
								md: "24",
							}}
							cursor={"pointer"}
						/>
					</Box>

					<Box className="icon-container">
						<Menu>
							<MenuButton>
								<CgMoreO size={24} cursor={"pointer"} />
							</MenuButton>
							<Portal>
								<MenuList bg={"gray.darkest"}>
									<MenuItem
										icon={<IoCopyOutline size={20} />}
										bg={"gray.darkest"}
										_hover={{ bg: "gray.darker" }}
										onClick={handleCopyProfile}
									>
										Copy Profile Link
									</MenuItem>
									<MenuItem
										icon={<IoShareSocial size={20} />}
										bg={"gray.darkest"}
										_hover={{ bg: "gray.darker" }}
										onClick={handleShareProfile}
									>
										Share Profile
									</MenuItem>
									{currentUser?._id === user._id && (
										<>
											<MenuItem
												icon={<BsSave size={20} />}
												bg={"gray.darkest"}
												_hover={{ bg: "gray.darker" }}
												onClick={showSavedPosts}
											>
												Saved Posts
											</MenuItem>
											<MenuItem
												icon={<IoSettingsOutline size={20} />}
												bg={"gray.darkest"}
												_hover={{ bg: "gray.darker" }}
												// onClick={openSettings}
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
