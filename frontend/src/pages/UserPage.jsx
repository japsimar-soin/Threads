import { useEffect, useState } from "react";
import { Flex, Spinner } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import UserPost from "../components/UserPost";
import UserHeader from "../components/UserHeader";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";

const UserPage = () => {
	const { user, loading } = useGetUserProfile();
	const [posts, setPosts] = useState([]);
	const [fetchingPosts, setFetchingPosts] = useState(true);
	const { username } = useParams();
	const showToast = useShowToast();

	useEffect(() => {
		const getPosts = async () => {
			setFetchingPosts(true);
			try {
				const res = await fetch(`/api/posts/user/${username}`);
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				setPosts(data);
			} catch (error) {
				showToast("Error", error, "error");
				setPosts([]);
			} finally {
				setFetchingPosts(false);
			}
		};
		getPosts();
	}, [username, showToast]);

	if (!user && loading) {
		return (
			<Flex justifyContent={"center"}>
				<Spinner size={"xl"} />
			</Flex>
		);
	}

	if (!user && !loading) {
		showToast("Error", "User does not exist", "error");
		return;
	}

	return (
		<>
			<UserHeader user={user} />
			{!fetchingPosts && posts.length === 0 && <h1>Nothing posted yet</h1>}
			{fetchingPosts && (
				<Flex justifyContent={"center"} my={12}>
					<Spinner size={"xl"} />
				</Flex>
			)}
			{posts.map((post) => (
				<Post key={post._id} post={post} postedBy={post.postedBy} />
			))}
		</>
	);
};

export default UserPage;
