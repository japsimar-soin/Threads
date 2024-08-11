import {
	Flex,
	Image,
	Input,
	InputGroup,
	InputRightElement,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Spinner,
	useDisclosure,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import useShowToast from "../hooks/useShowToast";
import {
	conversationAtom,
	selectedConversationAtom,
} from "../atoms/conversationAtom";
import { RiImageAddFill } from "react-icons/ri";
import { useRecoilValue, useSetRecoilState } from "recoil";
import usePreviewImage from "../hooks/usePreviewImage";

const MessageInput = ({ setMessages }) => {
	const [messageText, setMessageText] = useState("");
	const selectedConversation = useRecoilValue(selectedConversationAtom);
	const showToast = useShowToast();
	const imageRef = useRef(null);
	const { onClose } = useDisclosure();
	const { handleImageChange, image, setImage } = usePreviewImage();
	const setConversations = useSetRecoilState(conversationAtom);
	const [isSending, setIsSending] = useState(false);

	const handleSendMessage = async (e) => {
		e.preventDefault();
		if (!messageText && !image) return;
		if (isSending) return;
		setIsSending(true);
		try {
			const res = await fetch("/api/messages", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					message: messageText,
					recipientId: selectedConversation.userId,
					image: image,
				}),
			});
			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
			setMessages((messages) => [...messages, data]);
			// console.log(data);

			setConversations((prevConversation) => {
				const updatedConversations = prevConversation.map((conversation) => {
					if (conversation._id === selectedConversation._id) {
						return {
							...conversation,
							lastMessage: {
								text: messageText,
								sender: data.sender,
							},
						};
					}
					return conversation;
				});
				return updatedConversations;
			});
			setMessageText("");
			setImage("");
		} catch (error) {
			showToast("Error", error.message, "error");
		} finally {
			setIsSending(false);
		}
	};
	return (
		<Flex gap={2} alignItems={"center"}>
			<form onSubmit={handleSendMessage} style={{ flex: 95 }}>
				<InputGroup>
					<Input
						w={"full"}
						placeholder="Type your message"
						onChange={(e) => {
							setMessageText(e.target.value);
						}}
						value={messageText}
					/>
					<InputRightElement onClick={handleSendMessage} cursor={"pointer"}>
						<IoSendSharp />
					</InputRightElement>
				</InputGroup>
			</form>
			<Flex flex={5} cursor={"pointer"}>
				<RiImageAddFill size={20} onClick={() => imageRef.current.click()} />
				<Input
					type={"file"}
					hidden
					ref={imageRef}
					onChange={handleImageChange}
				/>
			</Flex>
			<Modal
				isOpen={image}
				onClose={() => {
					onClose();
					setImage("");
				}}
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader />
					<ModalCloseButton />
					<ModalBody>
						<Flex mt={5} w={"full"}>
							<Image src={image} />
						</Flex>
						<Flex justifyContent={"flex-end"} my={2}>
							{!isSending ? (
								<IoSendSharp
									size={24}
									cursor={"pointer"}
									onClick={handleSendMessage}
								/>
							) : (
								<Spinner size={"md"} />
							)}
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>
		</Flex>
	);
};

export default MessageInput;
