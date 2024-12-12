import bcrypt from "bcrypt";
export const hashText = async (text: string) => {
	return await bcrypt.hash(text, 10);
};

export const generatePin = async () => {
	return await hashText(
		Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000 + ""
	);
};
