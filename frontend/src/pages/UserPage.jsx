import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";

const UserPage = () => {
	return (
		<>
			<UserHeader />
			<UserPost
				likes={432}
				replies={34}
				postImg="post1.jpeg"
				postTile="This is a post1."
			/>
			<UserPost
				likes={420}
				replies={54}
				postImg="post2.jpeg"
				postTile="This is a post2."
			/>
			<UserPost
				likes={112}
				replies={35}
				postImg="post3.jpeg"
				postTile="This is a post3."
			/>
			<UserPost
				likes={452}
				replies={23}
				postImg="post4.jpeg"
				postTile="This is a post4."
			/>
		</>
	);
};

export default UserPage;
