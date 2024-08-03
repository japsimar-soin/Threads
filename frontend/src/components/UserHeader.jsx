import {
	Box,
	Flex,
	Link,
	Text,
	VStack,
	Avatar,
	Button,
} from "@chakra-ui/react";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/menu";
import { Portal } from "@chakra-ui/portal";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { Link as RouterLink } from "react-router-dom";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";

const UserHeader = ({ user }) => {
	const showToast = useShowToast();
	const currentUser = useRecoilValue(userAtom);
	const copyURL = () => {
		const currentURL = window.location.href;
		navigator.clipboard.writeText(currentURL).then(() => {
			showToast("Success", "URL copied to clipboard", "success");
		});
	};
	const [following, setFollowing] = useState(
		user.followers.includes(currentUser._id)
	);
	const [updating, setUpdating] = useState(false);
	const handleFollowUnfollow = async () => {
		if (!currentUser) {
			showToast("Error", "Login first", "error");
			return;
		}
		if(updating){
			return;
		}
		setUpdating(true);
		try {
			const res = await fetch(`/api/users/follow/${user._id}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
			if (following) {
				showToast("Success", `Unfollowed ${user.name}`, "success");
				user.followers.pop();
			} else {
				showToast("Success", `Followed ${user.name}`, "success");
				user.followers.push(currentUser._id);
			}
			setFollowing(!following);
		} catch (error) {
			showToast("Error", error, "error");
		} finally {
			setUpdating(false);
		}
	};

	return (
		<VStack gap={4} alignItems={"start"}>
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

			{currentUser._id === user._id && (
				<Link as={RouterLink} to="/update">
					<Button size={"sm"}>Update profile</Button>
				</Link>
			)}
			{currentUser._id !== user._id && (
				<Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>
					{following ? "Unfollow" : "Follow"}
				</Button>
			)}
			<Flex w={"full"} justifyContent={"space-between"}>
				<Flex gap={2} alignItems={"center"}>
					<Text color={"gray.light"}>{user.followers.length} followers</Text>
					<Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
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
						></BsInstagram>
					</Box>
					<Box className="icon-container">
						<Menu>
							<MenuButton>
								<CgMoreO size={24} cursor={"pointer"}></CgMoreO>
							</MenuButton>
							<Portal>
								<MenuList bg={"gray.darkest"}>
									<MenuItem
										bg={"gray.darkest"}
										_hover={{ bg: "gray.darker" }}
										onClick={copyURL}
									>
										Copy Link
									</MenuItem>
								</MenuList>
							</Portal>
						</Menu>
					</Box>
				</Flex>
			</Flex>
			<Flex w={"full"}>
				<Flex
					flex={1}
					borderBottom={"1.5px solid white"}
					justifyContent={"center"}
					pb={3}
					cursor={"pointer"}
				>
					<Text fontWeight={"bold"}>Threads</Text>
				</Flex>
				<Flex
					flex={1}
					borderBottom={"1.5px solid gray"}
					justifyContent={"center"}
					pb={3}
					color={"gray.light"}
					cursor={"pointer"}
				>
					<Text fontWeight={"bold"}>Replies</Text>
				</Flex>
			</Flex>
		</VStack>
	);
};

export default UserHeader;
