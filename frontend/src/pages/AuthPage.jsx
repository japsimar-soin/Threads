import { useRecoilValue } from "recoil";
import authAtom from "../atoms/authAtom";
import LoginCard from "../components/LoginCard";
import SignupCard from "../components/SignupCard";

const AuthPage = () => {
	const authScreenState = useRecoilValue(authAtom);
	return <>{authScreenState === "login" ? <LoginCard /> : <SignupCard />}</>;
};

export default AuthPage;
