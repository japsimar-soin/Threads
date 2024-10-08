import {
	Avatar,
	Box,
	Button,
	Divider,
	Flex,
	Image,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Portal,
	Spinner,
	Text,
	useColorMode,
	useDisclosure,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilState, useRecoilValue } from "recoil";
import { useEffect } from "react";
import { BsThreeDots } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import userAtom from "../atoms/userAtom";
import postAtom from "../atoms/postAtom";
import Actions from "../components/Actions";
import Comment from "../components/Comment";
import Report from "../components/Report";
import useShowToast from "../hooks/useShowToast";
import useSaveUnsavePost from "../hooks/useSaveUnsavePost";
import useGetUserProfile from "../hooks/useGetUserProfile";
import useGetPostCreationTime from "../hooks/useGetPostCreationTime";
import useReport from "../hooks/useReport";

const PostPage = () => {
	const [posts, setPosts] = useRecoilState(postAtom);
	const { user, loading } = useGetUserProfile();
	const { pid } = useParams();
	const { handleSaveUnsave, saving, saved } = useSaveUnsavePost(pid);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { colorMode } = useColorMode();
	const showToast = useShowToast();
	const currentUser = useRecoilValue(userAtom);
	const navigate = useNavigate();
	const currentPost = posts.length > 0 ? posts[0] : null;
	const timeAgo = useGetPostCreationTime(currentPost?.createdAt || new Date());

	const handleReport = useReport(currentPost?._id, currentUser);
	const handleReportSubmit = (reason) => {
		handleReport(reason);
	};

	useEffect(() => {
		const getPost = async () => {
			setPosts([]);

			try {
				const res = await fetch(`/api/posts/${pid}`);

				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}

				setPosts([data]);
			} catch (error) {
				showToast("Error", error.message, "error");
			}
		};

		getPost();
	}, [showToast, pid, setPosts]);

	if (loading || !currentPost) {
		return (
			<Flex justifyContent={"center"}>
				<Spinner size={"xl"} />
			</Flex>
		);
	}

	const handleDeletePost = async () => {
		try {
			if (!window.confirm("Delete this post?")) return;
			const res = await fetch(`/api/posts/${currentPost._id}`, {
				method: "DELETE",
			});

			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}

			showToast("Success", "Post deleted", "success");
			navigate(`/${user.username}`);
		} catch (error) {
			showToast("Error", error.message, "error");
		}
	};

	if (!user && loading) {
		return (
			<Flex justifyContent={"center"}>
				<Spinner size={"xl"} />
			</Flex>
		);
	}

	if (!currentPost) return null;

	return (
		<>
			<Flex mt={6}>
				<Flex w={"full"} alignItems={"center"} gap={3}>
					<Avatar src={user.profilePic} size={"md"} name={user.username} />
					<Flex alignItems={"center"}>
						<Text fontSize={"sm"} fontWeight={"bold"}>
							{user.username}
						</Text>
						<Image src="/verified.png" w="4" h="4" ml="2" />
					</Flex>
				</Flex>

				<Flex gap={1} alignItems={"center"}>
					<Text
						fontSize={"sm"}
						color={"gray.light"}
						textAlign={"right"}
						width={36}
					>
						{timeAgo} ago
					</Text>

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
						<Menu>
							<MenuButton>
								<BsThreeDots size={24} cursor={"pointer"} />
							</MenuButton>
							<Portal>
								<MenuList
									bg={colorMode === "light" ? "gray.lightest" : "gray.darkest"}
								>
									<MenuItem
										bg={
											colorMode === "light" ? "gray.lightest" : "gray.darkest"
										}
										_hover={{
											bg:
												colorMode === "light"
													? "gray.verylight"
													: "gray.darker",
										}}
										onClick={handleSaveUnsave}
									>
										{saving && (
											<Flex alignItems={"center"} justifyContent={"center"}>
												<Spinner size={"sm"} />
											</Flex>
										)}

										{!saving && (saved ? "Unsave" : "Save")}
									</MenuItem>
									<MenuItem
										bg={
											colorMode === "light" ? "gray.lightest" : "gray.darkest"
										}
										_hover={{
											bg:
												colorMode === "light"
													? "gray.verylight"
													: "gray.darker",
										}}
										onClick={onOpen}
									>
										Report
									</MenuItem>
								</MenuList>
							</Portal>
						</Menu>
					</Box>
				</Flex>
			</Flex>

			{currentPost.text && <Text my={3}>{currentPost.text}</Text>}
			{currentPost.image && (
				<Box
					borderRadius={6}
					overflow={"hidden"}
					border={"1px solid"}
					borderColor={"gray.light"}
				>
					<Image src={currentPost.image} w={"full"} />
				</Box>
			)}

			<Flex gap={3} my={3}>
				<Actions post={currentPost} />
			</Flex>

			{currentUser?._id === user._id && (
				<Flex
					justifyContent="flex-end"
					mt="auto"
					pb={4}
					pr={1}
					alignItems="center"
				>
					<DeleteIcon size={20} onClick={handleDeletePost} />
				</Flex>
			)}

			<Divider my={4} />
			<Text fontWeight={"bold"}>Replies</Text>

			{currentPost.replies.map((reply) => (
				<Comment
					key={reply._id}
					reply={reply}
					lastReply={
						reply._id ===
						currentPost.replies[currentPost.replies.length - 1]._id
					}
				/>
			))}
			<Divider my={4} />

			<Flex justifyContent={"space-between"}>
				<Flex gap={2} alignItems={"center"}>
					<Text fontSize={"2xl"}>👋</Text>
					<Text color={"gray.light"}>get the app to like and reply</Text>
				</Flex>
				<Button>Get</Button>
			</Flex>
			<Report isOpen={isOpen} onClose={onClose} onSubmit={handleReportSubmit} />

		</>
	);
};

export default PostPage;
