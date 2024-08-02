import {
	Flex,
	Box,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	InputRightElement,
	Stack,
	Button,
	Heading,
	Text,
	useColorModeValue,
	Link,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useSetRecoilState } from "recoil";
import authScreenAtom from "../atoms/authAtom";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";

export default function LoginCard() {
	const [showPassword, setShowPassword] = useState(false);
	const [inputs, setInputs] = useState({
		username: "",
		password: "",
	});
	const showToast = useShowToast();
	const setUser = useSetRecoilState(userAtom);
	const setAuthScreen = useSetRecoilState(authScreenAtom);
	const handleLogin = async () => {
		try {
			const res = await fetch("/api/users/login", {
				method: "POST", 
				headers: {
					"Content-Type": "application/json",
				}, 
				body: JSON.stringify(inputs)
			});
			const data = await res.json();
			if(data.error){
				showToast("Error", data.error, "error");
				return;
			}
			localStorage.setItem("user-info", JSON.stringify(data));
			setUser(data);
		} catch (error) {
			showToast("Error", error, "error");
		}
	};
	return (
		<Flex
			borderRadius={"xl"}
			align={"center"}
			justify={"center"}
			bg={useColorModeValue("gray.50", "gray.medium")}
		>
			<Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
				<Stack align={"center"}>
					<Heading fontSize={"4xl"} textAlign={"center"}>
						Login
					</Heading>
				</Stack>
				<Box
					rounded={"lg"}
					bg={useColorModeValue("white", "gray.dark")}
					boxShadow={"lg"}
					p={8}
					w={{
						base: "full",
						sm: "400px",
					}}
				>
					<Stack spacing={4}>
						<FormControl isRequired>
							<FormLabel>Username</FormLabel>
							<Input
								type="text"
								value={inputs.username}
								onChange={(e) =>
									setInputs((inputs) => ({
										...inputs,
										username: e.target.value,
									}))
								}
							/>
						</FormControl>
						<FormControl isRequired>
							<FormLabel>Password</FormLabel>
							<InputGroup>
								<Input
									type={showPassword ? "text" : "password"}
									value={inputs.password}
									onChange={(e) =>
										setInputs((inputs) => ({
											...inputs,
											password: e.target.value,
										}))
									}
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
								bg={"gray.medium"}
								color={"white"}
								_hover={{
									bg: "gray.light",
								}}
								onClick={handleLogin}
							>
								Login
							</Button>
						</Stack>
						<Stack pt={6}>
							<Text align={"center"}>
								Don&apos;t have an account?{" "}
								<Link
									color={"gray.light"}
									_hover={{
										color: "gray.300",
									}}
									onClick={() => setAuthScreen("signup")}
								>
									Sign up
								</Link>
							</Text>
						</Stack>
					</Stack>
				</Box>
			</Stack>
		</Flex>
	);
}
