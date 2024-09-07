import {
	Box,
	Divider,
	Flex,
	Spinner,
	useColorModeValue,
} from "@chakra-ui/react";
import { Fragment, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import postAtom from "../atoms/postAtom";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import Repost from "../components/Repost";
import SuggestedUsers from "../components/SuggestedUsers";

const HomePage = () => {
	const showToast = useShowToast();
	const [loading, setLoading] = useState(true);
	const [posts, setPosts] = useRecoilState(postAtom);

	useEffect(() => {
		const getFeedPosts = async () => {
			setLoading(true);
			setPosts([]);

			try {
				const res = await fetch("/api/posts/feed");
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}

				setPosts(data);
			} catch (error) {
				showToast("Error", error.message, "error");
			} finally {
				setLoading(false);
			}
		};

		getFeedPosts();
	}, [showToast, setPosts]);

	return (
		<Flex gap={4} alignItems={"flex-start"}>
			<Box
				flex={70}
				borderRadius={"md"}
				p={4}
				bg={useColorModeValue("gray.lightest", "gray.darker")}
			>
				{!loading && posts.length === 0 && <h1>No posts to show</h1>}

				{loading && (
					<Flex justifyContent={"center"}>
						<Spinner size={"xl"} />
					</Flex>
				)}

				{posts.map((post, i) => {
					return (
						<Fragment key={i}>
							{post.isRepost ? (
								<Repost post={post} repostedBy={post.repostedBy} />
							) : (
								<Post post={post} postedBy={post.postedBy} />
							)}
							<Divider />
						</Fragment>
					);
				})}
			</Box>

			<Box
				flex={30}
				display={{
					base: "none",
					md: "block",
				}}
			>
				<SuggestedUsers />
			</Box>
		</Flex>
	);
};

export default HomePage;
