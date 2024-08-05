import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";

const Comment = ({ reply, lastReply }) => {
	return (
		<>
			<Flex gap={4} py={2} my={2} w={"full"}>
				<Avatar src={reply.userProfilePic} size={"sm"} />
				<Flex gap={1} w={"full"} flexDirection={"column"}>
					<Flex
						w={"full"}
						justifyContent={"space-between"}
						alignItems={"center"}
					>
						<Text fontSize={"sm"} fontWeight={"bold"}>
							{reply.username}
						</Text>
						{/* <Flex>
							<Text fontSize={"sm"} color={"gray.light"}>
								{createdAt}
							</Text>
							<BsThreeDots />
						</Flex> */}
					</Flex>
					<Text>{reply.text}</Text>
					{/* <Actions post={post} />
					<Text fontSize={"sm"} color={"gray.light"}>
						{likes + (liked ? 1 : 0)} likes
					</Text> */}
				</Flex>
			</Flex>
			{!lastReply ? <Divider my={4} /> : null}
		</>
	);
};

export default Comment;
