import {
	Button,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	Input,
	Stack,
	useColorModeValue,
	Avatar,
	Center,
	HStack,
	Box,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import usePreviewImage from "../hooks/usePreviewImage";
import useShowToast from "../hooks/useShowToast";

export default function UpdateProfilePage() {
	const fileRef = useRef(null);
	const showToast = useShowToast();
	const { handleImageChange, image } = usePreviewImage();
	const [user, setUser] = useRecoilState(userAtom);
	const [inputs, setInputs] = useState({
		name: user.name ,
		username: user.username,
		email: user.email,
		bio: user.bio,
		password: "",
	});
	const [updating, setUpdating] = useState(false);
	// const renderPasswordPlaceholder = () => {
	// 	return "*".repeat(inputs.password.length);
	// };
	const handleSubmit = async (e) => {
		e.preventDefault();
		if(updating){
			return;
		}
		setUpdating(true);
		try {
			const res = await fetch(`/api/users/update/${user._id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ ...inputs, profilePic: image }),
			});
			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
			showToast("Success", "Profile updated", "success");
			setUser(data);
			localStorage.setItem("user-info", JSON.stringify(data));
		} catch (error) {
			showToast("Error", error, "error");
		} finally{
			setUpdating(false);
		}
	};
	return (
		<form onSubmit={handleSubmit}>
			<Flex
				minH={"100vh"}
				align={"center"}
				justify={"center"}
				my={4}
				bg={useColorModeValue("gray.50", "gray.darker")}
			>
				<Stack
					spacing={4}
					w={"full"}
					maxW={"md"}
					bg={useColorModeValue("white", "gray.darkest")}
					rounded={"xl"}
					boxShadow={"lg"}
					p={6}
					my={12}
				>
					<Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
						Update Profile
					</Heading>
					<FormControl>
						<Stack direction={["column", "row"]} spacing={6}>
							<Center>
								<Avatar
									size="xl"
									src={image || user.profilePic}
									boxShadow={"md"}
									showBorder={true}
								/>
							</Center>
							<Center w="full">
								<Button w="full" onClick={() => fileRef.current.click()}>
									Change Avatar
								</Button>
								<Input
									type="file"
									hidden
									ref={fileRef}
									onChange={handleImageChange}
								></Input>
							</Center>
						</Stack>
					</FormControl>
					<HStack>
						<Box>
							<FormControl isReadOnly>
								<FormLabel>Name</FormLabel>
								<Input
									type="text"
									value={inputs.name}
									onChange={(e) =>
										setInputs({ ...inputs, name: e.target.value })
									}
									placeholder="your name"
									_placeholder={{ color: "gray.500" }}
								/>
							</FormControl>
						</Box>
						<Box>
							<FormControl isReadOnly>
								<FormLabel>Username</FormLabel>
								<Input
									type="text"
									value={inputs.username}
									onChange={(e) =>
										setInputs({ ...inputs, username: e.target.value })
									}
									placeholder="username"
									_placeholder={{ color: "gray.500" }}
								/>
							</FormControl>
						</Box>
					</HStack>
					<FormControl isReadOnly>
						<FormLabel>Email</FormLabel>
						<Input
							type="email"
							value={inputs.email}
							onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
							placeholder="your-email@example.com"
							_placeholder={{ color: "gray.500" }}
						/>
					</FormControl>
					<FormControl>
						<FormLabel>Bio</FormLabel>
						<Input
							type="text"
							value={inputs.bio}
							placeholder="your bio"
							_placeholder={{ color: "gray.500" }}
							onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
						/>
					</FormControl>
					<FormControl>
						<FormLabel>Password</FormLabel>
						<Input
							type="password"
							value={inputs.password}
							onChange={(e) =>
								setInputs({ ...inputs, password: e.target.value })
							}
							placeholder="password"
							// placeholder={renderPasswordPlaceholder}
							_placeholder={{ color: "gray.500" }}
						/>
					</FormControl>
					<Stack spacing={6} direction={["column", "row"]}>
						<Button
							bg={useColorModeValue("gray.200", "gray.dark")}
							w="full"
							_hover={{
								bg: useColorModeValue("gray.verylight", "gray.lighter"),
							}}
                            type="button"
						>
							Cancel
						</Button>
						<Button
							bg={useColorModeValue("gray.lightest", "gray.mid")}
							w="full"
							_hover={{
								bg: useColorModeValue("gray.300", "gray.verylight"),
							}}
                            type="submit"
							isLoading={updating}
						>
							Submit
						</Button>
					</Stack>
				</Stack>
			</Flex>
		</form>
	);
}
