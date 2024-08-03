import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserPost from "../components/UserPost";
import UserHeader from "../components/UserHeader";
import useShowToast from "../hooks/useShowToast";

const UserPage = () => {
	const [user, setUser] = useState(null);
	const {username} = useParams();
	const showToast = useShowToast();
	useEffect(() => {
		const getUser = async()  => {
			try {
				const res = await fetch(`/api/users/profile/${username}`)
				const data = await res.json();
				// console.log(data);
				if(data.error){
					showToast("Error", data.error, "error");
					return;
				}
				setUser(data);

			} catch (error) {
				// console.log(error);
				showToast("Error", error, "error");
			}
		}
		getUser();
	}, [username, showToast]);
	if(!user){
		return null;
	}
	return (
		<>
			<UserHeader user={user}/>
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
