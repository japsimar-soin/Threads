import {
	Avatar,
	Box,
	Flex,
	Image,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Portal,
	Spinner,
	Text,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { BsThreeDots } from "react-icons/bs";
import { useRecoilState, useRecoilValue } from "recoil";
import useGetPostCreationTime from "../hooks/useGetPostCreationTime";
import useSaveUnsavePost from "../hooks/useSaveUnsavePost";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";
import postAtom from "../atoms/postAtom";
import Actions from "./Actions";

// import Repost from "./Repost";

const Post = ({ post, postedBy }) => {
// 	console.log("Post component re-rendered");
//   console.log("Post:", post);
//   console.log("Posted By:", postedBy);
	const [user, setUser] = useState(null);
	// const [loading, setLoading] = useState(true);
	const [posts, setPosts] = useRecoilState(postAtom);
	const { handleSaveUnsave, saving, saved } = useSaveUnsavePost(post._id);
	const showToast = useShowToast();
	const timeAgo = useGetPostCreationTime(post.createdAt);
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

	// const isRepost = post.isRepost;

	// const savePost = () => {};
	// const copyLink = () => {};
	// const reportProfile = () => {};

	useEffect(() => {
		console.log("useEffect triggered");
		const getUser = async () => {
			// console.log(postedBy);
			// console.log(post);
			try {
				// let userId = post.isRepost ? post.repostedBy._id : postedBy._id;
				const res = await fetch(`/api/users/profile/${postedBy._id}`);

				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				// console.log(data);
				setUser(data);
			} catch (error) {
				showToast("Error", error.message, "error");
				setUser(null);
			}
		};

		getUser();
	}, [postedBy._id, postedBy, showToast]);


	// useEffect(() => {
	// 	let isMounted = true; // to prevent state update on unmounted component

	// 	const getUser = async () => {
	// 		try {
	// 			const res = await fetch(`/api/users/profile/${postedBy._id}`);
	// 			const data = await res.json();

	// 			if (data.error) {
	// 				if (isMounted) showToast("Error", data.error, "error");
	// 				return;
	// 			}

	// 			if (isMounted) {
		// 			setUser(data);
		// 		}
		// 	} catch (error) {
		// 		if (isMounted) {
		// 			showToast("Error", error.message, "error");
		// 			setUser(null);
		// 		}
		// 	} finally {
		// 		if (isMounted) {
		// 			setLoading(false);
		// 		}
		// 	}
		// };

	// 	getUser();

	// 	return () => {
	// 		isMounted = false; // cleanup
	// 	};
	// }, [postedBy._id, showToast]);

	// if (loading) {
	// 	return (
	// 		<Flex justifyContent="center" alignItems="center" height="100px">
	// 			<Spinner />
	// 		</Flex>
	// 	);
	// }

	if (!user) {
		return null;
	}

	return (
		<Box>
			{/* {post.isRepost && (
				<>
					<Flex mb={4} py={3} px={4} bg="gray.800" borderRadius="md">
						<Avatar size="sm" src={post.repostedBy.profilePicture} mr={3} />
						<Flex flexDirection="column">
							<Flex gap={2} justifyContent={"center"} alignItems={"center"}>
								<Text fontSize="sm" fontWeight="bold">
									{post.repostedBy.username + " "}
								</Text>
								<Text fontSize={"sm"} fontWeight={"lighter"}>
									{" "}
									reposted this
								</Text>
							</Flex>
							<Text fontSize="xs" color="gray.500">
								{timeAgo} ago
							</Text>
						</Flex>
					</Flex>
					
				</>
			)} */}

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
						<Box w={"1px"} h={"86%"} bg={"gray.light"} my={2} />
						<Box position={"relative"} w={"full"}>
							{post.replies.length === 0 && (
								<Text textAlign={"center"}>🥱</Text>
							)}

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
									name={post.replies[1].username}
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
									name={post.replies[2].username}
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
										if (user?.username) {
											navigate(`/${user.username}`);
										}
									}}
								>
									{user?.username || "Loading"}
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
									{timeAgo} ago
								</Text>

								<Box
									className="icon-container"
									onClick={(e) => e.preventDefault()}
								>
									<Menu>
										<MenuButton>
											<BsThreeDots size={24} cursor={"pointer"} />
										</MenuButton>
										<Portal>
											<MenuList bg={"gray.darkest"}>
												<MenuItem
													bg={"gray.darkest"}
													_hover={{ bg: "gray.darker" }}
													onClick={handleSaveUnsave}
												>
													{saving && (
														<Flex
															alignItems={"center"}
															justifyContent={"center"}
														>
															<Spinner size={"sm"} />
														</Flex>
													)}
													{!saving && (saved ? "Unsave" : "Save")}
												</MenuItem>
												<MenuItem
													bg={"gray.darkest"}
													_hover={{ bg: "gray.darker" }}
													onClick={""}
												>
													Report
												</MenuItem>
											</MenuList>
										</Portal>
									</Menu>
								</Box>
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
						<Flex justifyContent={"space-between"}>
							<Flex gap={3} my={1} mt={1}>
								<Actions post={post} />
							</Flex>
							{currentUser?._id === user._id && (
								<Flex
									justifyContent="flex-start"
									mt="auto"
									pb={8}
									alignItems="center"
								>
									<DeleteIcon size={20} onClick={handleDeletePost} />
								</Flex>
							)}
						</Flex>
					</Flex>
				</Flex>
			</Link>
		</Box>
	);
};

export default Post;
