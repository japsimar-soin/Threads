import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Button,
	RadioGroup,
	Stack,
	Radio,
} from "@chakra-ui/react";
import { useState } from "react";

const Report = ({ isOpen, onClose, onSubmit }) => {
	const [reason, setReason] = useState("");

	const handleSubmit = () => {
		if(reason){
		onSubmit(reason);
		onClose();}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Report Post</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<RadioGroup onChange={setReason} value={reason}>
						<Stack direction="column">
							<Radio value="Spam">Spam</Radio>
							<Radio value="Harassment">Harassment</Radio>
							<Radio value="Hate Speech">Hate Speech</Radio>
							<Radio value="False Information">False Information</Radio>
							<Radio value="Other">Other</Radio>
						</Stack>
					</RadioGroup>
				</ModalBody>
				<ModalFooter>
					<Button
						colorScheme="blue"
						mr={3}
						onClick={handleSubmit}
						isDisabled={!reason}
					>
						Submit
					</Button>
					<Button variant="ghost" onClick={onClose}>
						Cancel
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default Report;
