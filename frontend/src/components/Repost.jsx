import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import Post from "./Post";

const Repost = ({ post, repostedBy }) => {
	return (
		<Box p={4} my={2}>
			<Flex align="center" mb={4}>
				<Avatar
					src={repostedBy.profilePic}
					name={repostedBy.username}
					size="sm"
					mr={2}
				/>
				<Text fontWeight="bold">{repostedBy.username} </Text>
				<Text ml={1}>reposted this </Text>
			</Flex>
			<Post post={post} postedBy={post.postedBy} />
		</Box>
	);
};

export default Repost;
