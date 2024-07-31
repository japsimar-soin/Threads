import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";
import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";

const Comment = ({ comment, createdAt, likes, userAvatar, username }) => {
	const [liked, setLiked] = useState(false);
	return (
		<>
			<Flex gap={4} py={2} my={2} w={"full"}>
				<Avatar src={userAvatar} size={"sm"} />
				<Flex gap={1} w={"full"} flexDirection={"column"}>
					<Flex
						w={"full"}
						justifyContent={"space-between"}
						alignItems={"center"}
					>
						<Text fontSize={"sm"} fontWeight={"bold"}>
							{username}
						</Text>
						<Flex>
							<Text fontSize={"sm"} color={"gray.light"}>
								{createdAt}
							</Text>
							<BsThreeDots />
						</Flex>
					</Flex>
					<Text>{comment}</Text>
					{/* <Actions liked={liked} setLiked={setLiked}/> */}
					<Text fontSize={"sm"} color={"gray.light"}>
						{likes + (liked ? 1 : 0)} likes
					</Text>
				</Flex>
			</Flex>
			<Divider my={4} />
			<Comment
				comment="Looks great."
				createdAt="2d"
				username="user1"
				userAvatar="/p1.jpeg"
				likes={2}
			/>
			<Comment
				comment="Keep up the good work"
				createdAt="1d"
				username="user3"
				userAvatar="/p3.jpeg"
				likes={13}
			/>
			<Comment
				comment="brilliant work."
				createdAt="2h"
				username="user2"
				userAvatar="/p2.jpeg"
				likes={23}
			/>
		</>
	);
};

export default Comment;
