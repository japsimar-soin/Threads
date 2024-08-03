import { Button, Flex, useColorModeValue } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const HomePage = () => {
	return (
		<Link to="/user4">
			<Flex w={"full"} justifyContent={"center"}>
				<Button mx={"auto"} bg={useColorModeValue("gray.300", "gray.medium")}>
					Visit Profile Page
				</Button>
			</Flex>
		</Link>
	);
};

export default HomePage;
