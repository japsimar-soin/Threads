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
	useDisclosure,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useRef, useState } from "react";
import { RiImageAddFill } from "react-icons/ri";
import { useRecoilValue } from "recoil";
import usePreviewImage from "../hooks/usePreviewImage";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";

const MAX_CHAR = 500;

const CreatePost = () => {
	const [postText, setPostText] = useState("");
	const [remainChar, setRemainChar] = useState(MAX_CHAR);
	const [loading, setLoading] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { handleImageChange, image, setImage } = usePreviewImage();
	const showToast = useShowToast();
	const imageRef = useRef(null);
	const user = useRecoilValue(userAtom);

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
	const handleCreatePost = async () => {
		setLoading(true);
		try {
			const res = await fetch(`/api/posts/create`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					postedBy: user._id,
					text: postText,
					image: image,
				}),
			});
			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
			showToast("Success", "Post created", "success");
			onClose();
			setPostText("");
			setImage("");
		} catch (error) {
			showToast("Error", error.message, "error");
		} finally {
			setLoading(false);
		}
	};
    

	return (
		<>
			<Button
				position={"fixed"}
				bottom={10}
				right={10}
				leftIcon={<AddIcon />}
				onClick={onOpen}
				bg={useColorModeValue("gray.300", "gray.darkest")}
			>
				Post
			</Button>
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
