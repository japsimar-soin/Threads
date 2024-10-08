import {
	Flex,
	Box,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	HStack,
	InputRightElement,
	Stack,
	Button,
	Heading,
	Text,
	useColorModeValue,
	Link,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { useSetRecoilState } from "recoil";
import authAtom from "../atoms/authAtom";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";

export default function SignupCard() {
	const showToast = useShowToast();
	const setUser = useSetRecoilState(userAtom);
	const setAuthScreen = useSetRecoilState(authAtom);
	const [showPassword, setShowPassword] = useState(false);
	const [inputs, setInputs] = useState({
		name: "",
		username: "",
		email: "",
		password: "",
	});

	const handleSignup = async () => {
		if (inputs.password.length < 6) {
			showToast("Error", "password needs minimum 6 characters", "error");
			return;
		}

		try {
			const res = await fetch("/api/users/signup", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(inputs),
			});

			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}

			localStorage.setItem("user-info", JSON.stringify(data));
			setUser(data);
		} catch (error) {
			showToast("Error", error.message, "error");
		}
	};

	return (
		<Flex
			borderRadius={"xl"}
			align={"center"}
			justify={"center"}
			bg={useColorModeValue("gray.50", "gray.darker")}
		>
			<Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
				<Stack align={"center"}>
					<Heading fontSize={"4xl"} textAlign={"center"}>
						Sign up
					</Heading>
				</Stack>
				<Box
					rounded={"xl"}
					bg={useColorModeValue("white", "gray.darkest")}
					boxShadow={"lg"}
					p={8}
				>
					<Stack spacing={4}>
						<HStack>
							<Box>
								<FormControl isRequired>
									<FormLabel>Name</FormLabel>
									<Input
										type="text"
										onChange={(e) =>
											setInputs({ ...inputs, name: e.target.value })
										}
										value={inputs.name}
									/>
								</FormControl>
							</Box>
							<Box>
								<FormControl isRequired>
									<FormLabel>Username</FormLabel>
									<Input
										type="text"
										onChange={(e) =>
											setInputs({ ...inputs, username: e.target.value })
										}
										value={inputs.username}
									/>
								</FormControl>
							</Box>
						</HStack>
						<FormControl isRequired>
							<FormLabel>Email</FormLabel>
							<Input
								type="email"
								onChange={(e) =>
									setInputs({ ...inputs, email: e.target.value })
								}
								value={inputs.email}
							/>
						</FormControl>
						<FormControl isRequired>
							<FormLabel>Password</FormLabel>
							<InputGroup>
								<Input
									type={showPassword ? "text" : "password"}
									onChange={(e) =>
										setInputs({ ...inputs, password: e.target.value })
									}
									value={inputs.password}
								/>
								<InputRightElement h={"full"}>
									<Button
										variant={"ghost"}
										onClick={() =>
											setShowPassword((showPassword) => !showPassword)
										}
									>
										{showPassword ? <ViewIcon /> : <ViewOffIcon />}
									</Button>
								</InputRightElement>
							</InputGroup>
						</FormControl>

						<Stack spacing={10} pt={2}>
							<Button
								loadingText="Submitting"
								size="lg"
								bg={"gray.darker"}
								color={"white"}
								_hover={{
									bg: "gray.light",
								}}
								onClick={handleSignup}
							>
								Sign up
							</Button>
						</Stack>

						<Stack pt={6}>
							<Text align={"center"}>
								Already a user?{" "}
								<Link
									color={"gray.light"}
									_hover={{
										color: "gray.300",
									}}
									onClick={() => setAuthScreen("login")}
								>
									Login
								</Link>
							</Text>
						</Stack>
					</Stack>
				</Box>
			</Stack>
		</Flex>
	);
}
