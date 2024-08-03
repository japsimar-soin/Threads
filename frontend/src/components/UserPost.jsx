import { Link } from "react-router-dom";
import { Avatar, Box, Flex, Image, Text, Button } from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
// import { useState } from "react";
// import { useToast } from "@chakra-ui/react";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/menu";
import { Portal } from "@chakra-ui/portal";
// import Actions from "./Actions";

const UserPost = ({ postImg, postTitle, likes, replies }) => {
	// const [liked, setLiked] = useState(false);
	const savePost = () => {};
	const copyLink = () => {};
	const reportProfile = () => {};
	return (
		<Link to="/user4/post/1">
			<Flex gap={3} mb={4} py={5}>
				<Flex flexDirection={"column"} alignItems={"center"}>
					<Avatar size={"md"} name={"User4"} src="/p4.jpeg" />
					<Box w={"1px"} h={"full"} bg={"gray.light"} my={2} />
					<Box position={"relative"} w={"full"}>
						<Avatar
							size={"xs"}
							name="Ishu"
							src="/p8.jpeg"
							position={"absolute"}
							top={"0px"}
							left={"15px"}
							p={"2px"}
						/>
						<Avatar
							size={"xs"}
							name="Ishu"
							src="/p9.jpeg"
							position={"absolute"}
							bottom={"0px"}
							right={"-5px"}
							p={"2px"}
						/>

						<Avatar
							size={"xs"}
							name="Ishu"
							src="/p10.jpeg"
							position={"absolute"}
							bottom={"0px"}
							left={"4px"}
							p={"2px"}
						/>
					</Box>
				</Flex>
				<Flex flex={1} flexDirection={"column"} gap={2}>
					<Flex justifyContent={"space-between"} w={"full"}>
						<Flex w={"full"} alignItems={"center"}>
							<Text fontSize={"sm"} fontWeight={"bold"}>
								user4
							</Text>
							<Image src="/verified.png" w={4} h={4} ml={1} />
						</Flex>
						<Flex gap={1} alignItems={"center"}>
							<Text fontStyle={"sm"} color={"gray.light"}>
								1d
							</Text>
							<Box onClick={(e) => e.preventDefault()}>
								<Menu>
									<MenuButton
										as={Button}
										bg="transparent"
										p={3}
										borderRadius="full"
										_hover={{ bg: "gray.darkest" }}
										_active={{ bg: "gray.darkest" }}
										_focus={{ boxShadow: "none" }}
									>
										<BsThreeDots cursor={"pointer"} />
									</MenuButton>
									<Portal>
										<MenuList bg={"gray.darkest"}>
											<MenuItem
												bg={"gray.darkest"}
												_hover={{ bg: "gray.darker" }}
												onClick={reportProfile}
											>
												Report Profile
											</MenuItem>
											<MenuItem
												bg={"gray.darkest"}
												_hover={{ bg: "gray.darker" }}
												onClick={copyLink}
											>
												Copy Link
											</MenuItem>
											<MenuItem
												bg={"gray.darkest"}
												_hover={{ bg: "gray.darker" }}
												onClick={savePost}
											>
												Save
											</MenuItem>
										</MenuList>
									</Portal>
								</Menu>
							</Box>
						</Flex>
					</Flex>
					<Text fontSize={"sm"}>{postTitle}</Text>
					{postImg && (
						<Box
							borderRadius={6}
							overflow={"hidden"}
							border={"1px solid"}
							borderColor={"gray.light"}
						>
							<Image src={postImg} w={"full"}></Image>
						</Box>
					)}
					{/* <Flex gap={3} my={1}>
						<Actions liked={liked} setLiked={setLiked} />
					</Flex> */}
					<Flex gap={2} alignItems={"center"}>
						<Text color={"gray.light"} fontSize={"sm"}>
							{replies} replies
						</Text>
						<Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
						<Text color={"gray.light"} fontSize={"sm"}>
							{likes} likes
						</Text>
					</Flex>
				</Flex>
			</Flex>
		</Link>
	);
};

export default UserPost;
