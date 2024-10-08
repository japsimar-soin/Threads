import { Fragment, useEffect, useState } from "react";
import { Divider, Flex, Spinner } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import postAtom from "../atoms/postAtom";
import Post from "../components/Post";
import Repost from "../components/Repost";
import UserHeader from "../components/UserHeader";
import useShowToast from "../hooks/useShowToast";
import useGetUserProfile from "../hooks/useGetUserProfile";

const UserPage = () => {
	const { user, loading } = useGetUserProfile();
	const { username } = useParams();
	const [posts, setPosts] = useRecoilState(postAtom);
	const [fetchingPosts, setFetchingPosts] = useState(true);
	const showToast = useShowToast();

	useEffect(() => {
		const getPosts = async () => {
			if (!user || loading) return;
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
	}, [username, showToast, loading, setPosts, user]);

	if (!user && loading) {
		return (
			<Flex justifyContent={"center"}>
				<Spinner size={"xl"} />
			</Flex>
		);
	}

	if (!user && !loading) {
		return <h1>User not found</h1>;
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
		</>
	);
};

export default UserPage;
