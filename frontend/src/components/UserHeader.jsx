import { Box, Flex, Link, Text, VStack, Avatar, useToast } from "@chakra-ui/react";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/menu";
import { Portal } from "@chakra-ui/portal";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";

const UserHeader = () => {
	const toast = useToast();

	const copyURL = () => {
		const currentURL = window.location.href;
		navigator.clipboard.writeText(currentURL).then(() => {
			toast({
				title: "Profile link copied",
				description: "URL copied to clipboard",
				status: "success",
				duration: 2000,
				isClosable: true,
			});
		});
	};
	return (
		<VStack gap={4} alignItems={"start"}>
			<Flex justifyContent={"space-between"} w={"full"}>
				<Box>
					<Text fontSize={"2xl"} fontWeight={"bold"}>
						User 4
					</Text>
					<Flex gap={2} alignItems={"center"}>
						<Text fontSize={"sm"}>user4</Text>
						<Text
							fontSize={"xs"}
							bg={"gray.dark"}
							color={"gray.light"}
							p={1}
							borderRadius={"full"}
						>
							threads.net
						</Text>
					</Flex>
				</Box>
				<Box>
					<Avatar
						name="User4"
						src="/p4.jpeg"
						size={{
							base: "lg",
							md: "2xl",
						}}
					></Avatar>
				</Box>
			</Flex>
			<Text>Lorem ipsum dolor sit amet consectetur adipisicing elit.</Text>
			<Flex w={"full"} justifyContent={"space-between"}>
				<Flex gap={2} alignItems={"center"}>
					<Text color={"gray.light"}>3.2K followers</Text>
					<Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
					<Link color={"gray.light"}>instagram.com</Link>
				</Flex>
				<Flex>
					<Box className="icon-container">
						<BsInstagram size={{
							base: "18",
							md: "24"
						}} cursor={"pointer"}></BsInstagram>
					</Box>
					<Box className="icon-container">
						<Menu>
							<MenuButton>
								<CgMoreO size={24} cursor={"pointer"}></CgMoreO>
							</MenuButton>
							<Portal>
								<MenuList bg={"gray.dark"}>
									<MenuItem bg={"gray.dark"} _hover={{ bg: "gray.medium" }} onClick={copyURL}>
										Copy Link
									</MenuItem>
								</MenuList>
							</Portal>
						</Menu>
					</Box>
				</Flex>
			</Flex>
			<Flex w={"full"}>
				<Flex
					flex={1}
					borderBottom={"1.5px solid white"}
					justifyContent={"center"}
					pb={3}
					cursor={"pointer"}
				>
					<Text fontWeight={"bold"}>Threads</Text>
				</Flex>
				<Flex
					flex={1}
					borderBottom={"1.5px solid gray"}
					justifyContent={"center"}
					pb={3}
					color={"gray.light"}
					cursor={"pointer"}
				>
					<Text fontWeight={"bold"}>Replies</Text>
				</Flex>
			</Flex>
		</VStack>
	);
};

export default UserHeader;
