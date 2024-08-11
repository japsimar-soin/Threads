import { Link, useNavigate } from "react-router-dom";
import {
	Avatar,
	Box,
	Flex,
	Image,
	Text,
	// Button,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { DeleteIcon } from "@chakra-ui/icons";
// import { BsThreeDots } from "react-icons/bs";
// import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/menu";
// import { Portal } from "@chakra-ui/portal";
import { useRecoilState, useRecoilValue } from "recoil";
import { formatDistanceToNow } from "date-fns";
// import useGetPostCreationTime from "../hooks/useGetPostCreationTime";
import useShowToast from "../hooks/useShowToast";
import Actions from "./Actions";
import userAtom from "../atoms/userAtom";
import postAtom from "../atoms/postAtom";

const Post = ({ post, postedBy }) => {
	const [user, setUser] = useState(null);
	const [posts, setPosts] = useRecoilState(postAtom);
	// const { numericValue, unit } = useGetPostCreationTime(post.createdAt);
	const showToast = useShowToast();
	const navigate = useNavigate();
	const currentUser = useRecoilValue(userAtom);

	const handleDeletePost = async (e) => {
		try {
			e.preventDefault();
			if (!window.confirm("Delete this post?")) return;
			const res = await fetch(`/api/posts/${post._id}`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
			showToast("Success", "Post deleted", "success");
			setPosts(posts.filter((p) => p._id !== post._id));
		} catch (error) {
			showToast("Error", error.message, "error");
		}
	};
	// const savePost = () => {};
	// const copyLink = () => {};
	// const reportProfile = () => {};
	useEffect(() => {
		const getUser = async () => {
			try {
				const res = await fetch("/api/users/profile/" + postedBy);
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				setUser(data);
			} catch (error) {
				showToast("Error", error.message, "error");
				setUser(null);
			}
		};
		getUser();
	}, [postedBy, showToast]);

	if (!user) {
		return null;
	}

	return (
		<Link to={`/${user.username}/post/${post._id}`}>
			<Flex gap={3} mb={4} py={5}>
				<Flex flexDirection={"column"} alignItems={"center"}>
					<Avatar
						size={"md"}
						name={user.name}
						src={user?.profilePic}
						onClick={(e) => {
							e.preventDefault();
							navigate(`/${user.username}`);
						}}
					/>
					<Box w={"1px"} h={"full"} bg={"gray.light"} my={2} />
					<Box position={"relative"} w={"full"}>
						{post.replies.length === 0 && <Text textAlign={"center"}>🥱</Text>}
						
						{post.replies[0] && (
							<Avatar
								size={"xs"}
								name={post.replies[0].username}
								src={post.replies[0].userProfilePic}
								position={"absolute"}
								top={"0px"}
								left={"15px"}
								p={"2px"}
							/>
						)}
						{post.replies[1] && (
							<Avatar
								size={"xs"}
								name="Ishu"
								src={post.replies[1].userProfilePic}
								position={"absolute"}
								bottom={"0px"}
								right={"-5px"}
								p={"2px"}
							/>
						)}

						{post.replies[2] && (
							<Avatar
								size={"xs"}
								name="Ishu"
								src={post.replies[2].userProfilePic}
								position={"absolute"}
								bottom={"0px"}
								left={"4px"}
								p={"2px"}
							/>
						)}
					</Box>
				</Flex>

				<Flex flex={1} flexDirection={"column"} gap={2}>
					<Flex justifyContent={"space-between"} w={"full"}>
						<Flex w={"full"} alignItems={"center"}>
							<Text
								fontSize={"sm"}
								fontWeight={"bold"}
								onClick={(e) => {
									e.preventDefault();
									navigate(`/${user.username}`);
								}}
							>
								{user?.username}
							</Text>
							<Image src="/verified.png" w={4} h={4} ml={1} />
						</Flex>
						<Flex gap={1} alignItems={"center"}>
							<Text
								fontSize={"sm"}
								color={"gray.light"}
								textAlign={"right"}
								width={36}
							>
								{formatDistanceToNow(new Date(post.createdAt))} ago
							</Text>

							{currentUser?._id === user._id && (
								<DeleteIcon size={20} ml={4} onClick={handleDeletePost} />
							)}
						</Flex>
					</Flex>
					<Text fontSize={"sm"}>{post.text}</Text>
					{post.image && (
						<Box
							borderRadius={6}
							overflow={"hidden"}
							border={"1px solid"}
							borderColor={"gray.light"}
						>
							<Image src={post.image} w={"full"} />
						</Box>
					)}
					<Flex gap={3} my={1}>
						<Actions post={post} />
					</Flex>
				</Flex>
			</Flex>
		</Link>
	);
};

export default Post;
