import { Container } from "@chakra-ui/react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import Header from "./components/Header";
import LogoutButton from "./components/LogoutButton";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import userAtom from "./atoms/userAtom";

function App() {
	const user = useRecoilValue(userAtom);
	return (
		<Container maxW="620px">
			<Header></Header>
			<Routes>
				<Route
					path="/"
					element={user ? <HomePage /> : <Navigate to="/auth" />}
				/>
				<Route
					path="/auth"
					element={!user ? <AuthPage /> : <Navigate to="/" />}
				/>
				<Route
					path="/update"
					element={user ? <UpdateProfilePage /> : <Navigate to="/auth" />}
				/>
				<Route path="/:username" element={<UserPage />} />
				<Route path="/:username/post/:pid" element={<PostPage />} />
			</Routes>
			{user && <LogoutButton />}
		</Container>
	);
}

export default App;
