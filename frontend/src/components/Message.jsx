import { Avatar, Box, Flex, Image, Skeleton, Text } from "@chakra-ui/react";
import { BsCheck2All } from "react-icons/bs";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { selectedConversationAtom } from "../atoms/conversationAtom";
import userAtom from "../atoms/userAtom";

const Message = ({ ownMessage, message }) => {
	const user = useRecoilValue(userAtom);
	const selectedConversation = useRecoilValue(selectedConversationAtom);
	const [imageLoaded, setImageLoaded] = useState(false);

	return (
		<>
			{ownMessage ? (
				<Flex gap={2} alignSelf={"flex-end"}>
					{message.text && (
						<Flex bg={"green.800"} maxW={"350px"} p={1} borderRadius={"md"}>
							<Text color={"white"}>{message.text}</Text>
							<Box
								alignSelf={"flex-end"}
								ml={1}
								color={message.seen ? "blue.400" : ""}
								fontWeight={"bold"}
							>
								<BsCheck2All size={16} />
							</Box>
						</Flex>
					)}

					{message.image && !imageLoaded && (
						<Flex mt={5} w={"200px"}>
							<Image
								src={message.image}
								hidden
								onLoad={() => setImageLoaded(true)}
								alt={"Image"}
								borderRadius={4}
							/>
							<Skeleton w={"200px"} h={"200px"} />
						</Flex>
					)}

					{message.image && imageLoaded && (
						<Flex mt={5} w={"200px"}>
							<Image src={message.image} alt={"Image"} borderRadius={4} />
							<Box
								alignSelf={"flex-end"}
								ml={1}
								color={message.seen ? "blue.400" : ""}
								fontWeight={"bold"}
							>
								<BsCheck2All size={16} />
							</Box>
						</Flex>
					)}

					<Avatar src={user.profilePic} w={8} h={8} />
				</Flex>
			) : (
				<Flex gap={2}>
					<Avatar src={selectedConversation.userProfilePic} w={8} h={8} />

					{message.text && (
						<Text
							maxW={"350px"}
							bg={"gray.400"}
							p={1}
							color={"black"}
							borderRadius={"md"}
						>
							{message.text}
						</Text>
					)}

					{message.image && !imageLoaded && (
						<Flex mt={5} w={"200px"}>
							<Image
								src={message.image}
								hidden
								onLoad={() => setImageLoaded(true)}
								alt={"Image"}
								borderRadius={4}
							/>
							<Skeleton w={"200px"} h={"200px"} />
						</Flex>
					)}

					{message.image && imageLoaded && (
						<Flex mt={5} w={"200px"}>
							<Image src={message.image} alt={"Image"} borderRadius={4} />
						</Flex>
					)}
				</Flex>
			)}
		</>
	);
};

export default Message;
