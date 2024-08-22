import {
	Button,
	CloseButton,
	Flex,
	FormControl,
	Image,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	Textarea,
	useColorModeValue,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { RiImageAddFill } from "react-icons/ri";
import usePreviewImage from "../hooks/usePreviewImage";
import useCreatePost from "../hooks/useCreatePost";

const MAX_CHAR = 500;

const CreatePost = ({ isOpen, onClose }) => {
	const [postText, setPostText] = useState("");
	const [remainChar, setRemainChar] = useState(MAX_CHAR);
	const { handleImageChange, image, setImage } = usePreviewImage();
	const { createPost, loading } = useCreatePost();
	const imageRef = useRef(null);

	const handleTextChange = (e) => {
		const inputText = e.target.value;
		if (inputText.length > MAX_CHAR) {
			const truncatedText = inputText.slice(0, MAX_CHAR);
			setPostText(truncatedText);
			setRemainChar(0);
		} else {
			setPostText(inputText);
			setRemainChar(MAX_CHAR - inputText.length);
		}
	};

	const handleCreatePost = () => {
		createPost(postText, image, onClose, setPostText, setImage);
	};

	return (
		<>
			{/* <Button
				position={"fixed"}
				bottom={10}
				right={3}
				onClick={onOpen}
				bg={useColorModeValue("gray.300", "gray.darkest")}
				_hover={{ bg: useColorModeValue("gray.400", "gray.mid") }}
				display={{ base: "none", md: "block" }}
			>
				<AddIcon />
			</Button> */}

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader bg={useColorModeValue("white", "gray.dark")}>
						Create Post
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody pb={6} bg={useColorModeValue("white", "gray.dark")}>
						<FormControl>
							<Textarea
								placeholder="Post content here"
								onChange={handleTextChange}
								value={postText}
							/>
							<Text
								fontSize={"xs"}
								fontWeight={"bold"}
								textAlign={"right"}
								m={1}
								color={useColorModeValue("gray.dark", "gray.100")}
							>
								{remainChar}/{MAX_CHAR}
							</Text>
							<Input
								type="file"
								hidden
								ref={imageRef}
								onChange={handleImageChange}
							/>
							<RiImageAddFill
								style={{ marginLeft: "5px", cursor: "pointer" }}
								size={28}
								onClick={() => imageRef.current.click()}
							/>
						</FormControl>

						{image && (
							<Flex mt={5} w={"full"} position={"relative"}>
								<Image src={image} alt={"Selected image"} />
								<CloseButton
									onClick={() => setImage("")}
									bg={"gray.medium"}
									position={"absolute"}
									top={2}
									right={2}
								/>
							</Flex>
						)}
					</ModalBody>
					<ModalFooter bg={useColorModeValue("white", "gray.dark")}>
						<Button
							colorScheme="blue"
							mr={3}
							onClick={handleCreatePost}
							isLoading={loading}
						>
							Post
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default CreatePost;
