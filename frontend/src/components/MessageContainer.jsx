import {
	Avatar,
	Divider,
	Flex,
	Image,
	Skeleton,
	SkeletonCircle,
	Text,
	useColorModeValue,
} from "@chakra-ui/react";
import { useSocket } from "../context/SocketContext";
import { useEffect, useRef, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
	conversationAtom,
	selectedConversationAtom,
} from "../atoms/conversationAtom";
import userAtom from "../atoms/userAtom";
import notificationSound from "../assets/sounds/notification.mp3";
import useShowToast from "../hooks/useShowToast";
import Message from "./Message";
import MessageInput from "./MessageInput";

const MessageContainer = () => {
	const showToast = useShowToast();
	const selectedConversation = useRecoilValue(selectedConversationAtom);
	const currentUser = useRecoilValue(userAtom);
	const setConversations = useSetRecoilState(conversationAtom);
	const messageEndRef = useRef(null);
	const [messages, setMessages] = useState([]);
	const [loadingMessages, setLoadingMessages] = useState(true);
	const { socket } = useSocket();

	useEffect(() => {
		socket.on("newMessage", (message) => {
			if (selectedConversation._id === message.conversationId) {
				setMessages((prev) => [...prev, message]);
			}

			if (!document.hasFocus()) {
				const sound = new Audio(notificationSound);
				sound.play();
			}

			setConversations((prevConversations) => {
				const updatedConversations = prevConversations.map((conversation) => {
					if (conversation._id === message.conversationId) {
						return {
							...conversation,
							lastMessage: {
								text: message.text,
								isImage: message.isImage,
								sender: message.sender,
							},
						};
					}
					return conversation;
				});
				return updatedConversations;
			});
		});

		return () => socket.off("newMessage");
	}, [socket, selectedConversation, setConversations]);

	useEffect(() => {
		const lastMessageFromOtherUser =
			messages.length &&
			messages[messages.length - 1].sender !== currentUser._id;

		if (lastMessageFromOtherUser) {
			socket.emit("markMessageSeen", {
				conversationId: selectedConversation._id,
				userId: selectedConversation.userId,
			});
		}

		socket.on("messageSeen", ({ conversationId }) => {
			if (selectedConversation._id === conversationId) {
				setMessages((prevMessages) => {
					const updatedMessages = prevMessages.map((message) => {
						if (!message.seen) {
							return {
								...message,
								seen: true,
							};
						}
						return message;
					});
					return updatedMessages;
				});
			}
		});
	}, [socket, currentUser._id, messages, selectedConversation]);

	// useEffect(() => {
	// 	messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
	// }, [messages]);

	useEffect(() => {
		const timer = setTimeout(() => {
			messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
		}, 100); // Delay to ensure messages are fully rendered

		return () => clearTimeout(timer);
	}, [messages]);

	useEffect(() => {
		const getMessages = async () => {
			setLoadingMessages(true);
			setMessages([]);

			try {
				if (selectedConversation.mock) return;
				const res = await fetch(`/api/messages/${selectedConversation.userId}`);
				const data = await res.json();

				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}

				setMessages(data);
			} catch (error) {
				showToast("Error", error.message, "error");
			} finally {
				setLoadingMessages(false);
			}
		};

		getMessages();
	}, [showToast, selectedConversation.userId, selectedConversation.mock]);

	return (
		<Flex
			flex={70}
			bg={useColorModeValue("gray.lightest", "gray.darker")}
			borderRadius={"md"}
			flexDirection={"column"}
			p={2}
		>
			<Flex w={"full"} h={12} alignItems={"center"} gap={2}>
				<Avatar
					src={selectedConversation.userProfilePic}
					h={12}
					w={12}
					p={1}
					mb={2}
				/>

				<Text display={"flex"} alignItems={"center"}>
					{selectedConversation.username}{" "}
					<Image src={"/verified.png"} h={4} w={4} ml={1} />
				</Text>
			</Flex>

			<Divider />

			<Flex
				flexDirection={"column"}
				gap={4}
				my={4}
				p={2}
				height={"400px"}
				overflowY={"auto"}
			>
				{loadingMessages &&
					[...Array(5)].map((_, i) => (
						<Flex
							key={i}
							gap={2}
							alignItems={"center"}
							p={1}
							borderRadius={"md"}
							alignSelf={i % 2 === 0 ? "flex-start" : "flex-end"}
						>
							{i % 2 === 0 && <SkeletonCircle size={8} />}
							<Flex flexDirection={"column"} gap={2}>
								<Skeleton h={"8px"} w={"250px"} />
								<Skeleton h={"8px"} w={"250px"} />
								<Skeleton h={"8px"} w={"250px"} />
							</Flex>
							{i % 2 !== 0 && <SkeletonCircle size={7} />}
						</Flex>
					))}

				{!loadingMessages &&
					messages.map((message) => (
						<Flex
							key={message._id}
							direction={"column"}
							ref={
								messages.length - 1 === messages.indexOf(message)
									? messageEndRef
									: null
							}
						>
							<Message
								message={message}
								ownMessage={currentUser._id === message.sender}
							/>
						</Flex>
					))}
					<div ref={messageEndRef} />
			</Flex>

			<MessageInput setMessages={setMessages} />
		</Flex>
	);
};

export default MessageContainer;
