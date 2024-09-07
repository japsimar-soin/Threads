import {
	Box,
	Divider,
	Flex,
	Spinner,
	useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";

const SavedPostsPage = () => {
	const showToast = useShowToast();
	const [loading, setLoading] = useState(true);
	const [savedPosts, setSavedPosts] = useState([]);

	useEffect(() => {
		const getSavedPosts = async () => {
			setLoading(true);
			setSavedPosts([]);
			try {
				const res = await fetch("api/users/saved");

				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}

				setSavedPosts(data);
			} catch (error) {
				showToast("Error", error.message, "error");
			} finally {
				setLoading(false);
			}
		};
		getSavedPosts();
	}, [showToast]);

	return (
		<>
			{/* <Flex gap={4} alignItems={"flex-start"}> */}
			<Box
				// flex={70}
				borderRadius={"md"}
				p={4}
				bg={useColorModeValue("gray.lightest", "gray.800")}
			>
				{!loading && savedPosts.length === 0 && <h1>No posts to show</h1>}

				{loading && (
					<Flex justifyContent={"center"}>
						<Spinner size={"xl"} />
					</Flex>
				)}

				{savedPosts.map((post) => (
					<React.Fragment key={post._id}>
						<Post post={post} postedBy={post.postedBy} />
						<Divider />
					</React.Fragment>
				))}
			</Box>

			{/* </Flex> */}
		</>
	);
};

export default SavedPostsPage;
