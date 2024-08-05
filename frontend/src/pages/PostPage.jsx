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
import { useEffect, useState } from "react";
// import { BsThreeDots } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilValue } from "recoil";
import Comment from "../components/Comment";
import Actions from "../components/Actions";
import useShowToast from "../hooks/useShowToast";
import useGetUserProfile from "../hooks/useGetUserProfile";
import useGetPostCreationTime from "../hooks/useGetPostCreationTime";
import userAtom from "../atoms/userAtom";

const PostPage = () => {
	const { user, loading } = useGetUserProfile();
	const { pid } = useParams();
	const [post, setPost] = useState(null);
	const { numericValue, unit } = useGetPostCreationTime(post.createdAt);
	const currentUser = useRecoilValue(userAtom);
	const showToast = useShowToast();
	const navigate = useNavigate();
	const handleDeletePost = async () => {
		try {
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
			navigate(`/${user.username}`);
		} catch (error) {
			showToast("Error", error.message, "error");
		}
	};
	useEffect(() => {
		const getPost = async () => {
			try {
				const res = await fetch(`/api/posts/${pid}`);
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				console.log(data);
				setPost(data);
			} catch (error) {
				showToast("Error", error.message, "error");
			}
		};
		getPost();
	}, [showToast, pid]);

	if (!user && loading) {
		return (
			<Flex justifyContent={"center"}>
				<Spinner size={"xl"}></Spinner>
			</Flex>
		);
	}

	if (!post) return null;
	return (
		<>
			<Flex>
				<Flex w={"full"} alignItems={"center"} gap={3}>
					<Avatar src={user.profilePic} size={"md"} name="user4"></Avatar>
					<Flex alignItems={"center"}>
						<Text fontSize={"sm"} fontWeight={"bold"}>
							{user.username}
						</Text>
						<Image src="/verified.png" w="4" h="4" ml="2"></Image>
					</Flex>
				</Flex>
				<Flex gap={1} alignItems={"center"}>
					<Text
						fontSize={"sm"}
						color={"gray.light"}
						textAlign={"right"}
						width={36}
					>
						{numericValue + unit} ago
					</Text>

					{currentUser?._id === user._id && (
						<DeleteIcon
							size={20}
							ml={4}
							cursor={"pointer"}
							onclick={handleDeletePost}
						/>
					)}
				</Flex>
			</Flex>
			<Text my={3}>Let&apos;s talk about threads.</Text>
			{post.image && (
				<Box
					borderRadius={6}
					overflow={"hidden"}
					border={"1px solid"}
					borderColor={"gray.light"}
				>
					<Image src={post.image} w={"full"}></Image>
				</Box>
			)}
			<Flex gap={3} my={3}>
				<Actions post={post} />
			</Flex>
			<Flex gap={2} alignItems={"center"}>
				<Text color={"gray.light"} fontSize={"sm"}>
					{post.replies.length} replies
				</Text>
				<Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
				<Text color={"gray.light"} fontSize={"sm"}>
					{post.likes.length} likes
				</Text>
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
			{post.replies.map((reply) => (
				<Comment key={reply._id} reply={reply} lastReply={reply._id === post.replies[post.replies.length-1]._id} />
			))}
		</>
	);
};

export default PostPage;
