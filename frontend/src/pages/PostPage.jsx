import {
	Avatar,
	Box,
	Button,
	Divider,
	Flex,
	Image,
	Spinner,
	Text,
} from "@chakra-ui/react";
// import { BsThreeDots } from "react-icons/bs";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilState, useRecoilValue } from "recoil";
import { formatDistanceToNow } from "date-fns";
import Actions from "../components/Actions";
import Comment from "../components/Comment";
import useShowToast from "../hooks/useShowToast";
import useGetUserProfile from "../hooks/useGetUserProfile";
// import useGetPostCreationTime from "../hooks/useGetPostCreationTime";
import userAtom from "../atoms/userAtom";
import postAtom from "../atoms/postAtom";

const PostPage = () => {
	const { user, loading } = useGetUserProfile();
	const [posts, setPosts] = useRecoilState(postAtom);
	const showToast = useShowToast();
	const { pid } = useParams();
	const currentUser = useRecoilValue(userAtom);
	const navigate = useNavigate();
	const currentPost = posts[0]; // Ensure currentPost is not undefined

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
				console.log(data);
				setPosts([data]);
			} catch (error) {
				showToast("Error", error.message, "error");
			}
		};
		getPost();
	}, [showToast, pid, setPosts]);
	// const currentPost = posts[0];
	// const { numericValue, unit } = useGetPostCreationTime(currentPost.createdAt);
	// const { numericValue, unit } = useGetPostCreationTime(currentPost?.createdAt); // Default to current date if createdAt is undefined

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
				<Spinner size={"xl"}></Spinner>
			</Flex>
		);
	}
	if (!currentPost) return null;
	console.log("currentPost", currentPost);
	return (
		<>
			<Flex>
				<Flex w={"full"} alignItems={"center"} gap={3}>
					<Avatar src={user.profilePic} size={"md"} name={user.username}></Avatar>
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
						{formatDistanceToNow(new Date(currentPost.createdAt))} ago
						{/* {numericValue + unit} ago */}
					</Text>

					{currentUser?._id === user._id && (
						<DeleteIcon
							size={20}
							ml={4}
							cursor={"pointer"}
							onClick={handleDeletePost}
						/>
					)}
				</Flex>
			</Flex>
			<Text my={3}>{currentPost.text}</Text>
			{currentPost.image && (
				<Box
					borderRadius={6}
					overflow={"hidden"}
					border={"1px solid"}
					borderColor={"gray.light"}
				>
					<Image src={currentPost.image} w={"full"}></Image>
				</Box>
			)}
			<Flex gap={3} my={3}>
				<Actions post={currentPost} />
			</Flex>

			<Divider my={4}></Divider>
			<Flex justifyContent={"space-between"}>
				<Flex gap={2} alignItems={"center"}>
					<Text fontSize={"2xl"}>👋</Text>
					<Text color={"gray.light"}>get the app to like and reply</Text>
				</Flex>
				<Button>Get</Button>
			</Flex>
			<Divider my={4} />
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
		</>
	);
};

export default PostPage;
