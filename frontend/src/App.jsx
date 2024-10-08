import { Box, Container } from "@chakra-ui/react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import Header from "./components/Header";
// import CreatePost from "./components/CreatePost";
import LogoutButton from "./components/LogoutButton";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import ChatPage from "./pages/ChatPage";
import SettingsPage from "./pages/SettingsPage";
import SavedPostsPage from "./pages/SavedPostsPage";
import UpdateProfilePage from "./pages/UpdateProfilePage";

function App() {
	const user = useRecoilValue(userAtom);
	const { pathname } = useLocation();

	return (
		<Box position={"relative"} w={"full"}>
			<Header />
			<Container
				maxW={pathname === "/" ? { base: "620px", md: "800px" } : "620px"}
				pt={40}
			>
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
					<Route
						path="/chat"
						element={user ? <ChatPage /> : <Navigate to="/auth" />}
					/>
					<Route
						path="/settings"
						element={user ? <SettingsPage /> : <Navigate to="/auth" />}
					/>
					<Route
						path="/saved"
						element={user ? <SavedPostsPage /> : <Navigate to="/auth" />}
					/>
				</Routes>
				{user && <LogoutButton />}
				{/* {user && <CreatePost />} */}
			</Container>
		</Box>
	);
}

export default App;
