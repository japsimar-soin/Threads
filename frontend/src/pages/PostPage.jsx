import {
	Avatar,
	Flex,
	Image,
	Text,
	Box,
	Divider,
	Button,
} from "@chakra-ui/react";
import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import Comment from "../components/Comment";
// import Actions from "../components/Actions";

const PostPage = () => {
	const [liked, setLiked] = useState(false);
	return (
		<>
			<Flex>
				<Flex w={"full"} alignItems={"center"} gap={3}>
					<Avatar src="/p4.jpeg" size={"md"} name="user4"></Avatar>
					<Flex alignItems={"center"}>
						<Text fontSize={"sm"} fontWeight={"bold"}>
							user4
						</Text>
						<Image src="/verified.png" w="4" h="4" ml="2"></Image>
					</Flex>
				</Flex>
				<Flex gap={4} alignItems={"center"}>
					<Text fontSize={"sm"} color={"gray.light"}>
						1d
					</Text>
					<BsThreeDots />
				</Flex>
			</Flex>
			<Text my={3}>Let&apos;s talk about threads.</Text>
			<Box
				borderRadius={6}
				overflow={"hidden"}
				border={"1px solid"}
				borderColor={"gray.light"}
			>
				<Image src={"/post1.jpeg"} w={"full"}></Image>
			</Box>
			<Flex gap={3} my={3}>
				{/* <Actions liked={liked} setLiked={setLiked}/> */}
			</Flex>
			<Flex gap={2} alignItems={"center"}>
				<Text color={"gray.light"} fontSize={"sm"}>
					238 replies
				</Text>
				<Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
				<Text color={"gray.light"} fontSize={"sm"}>
					{200 + (liked ? 1 : 0)} likes
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
			<Divider my={4}></Divider>
			<Comment />
		</>
	);
};

export default PostPage;
