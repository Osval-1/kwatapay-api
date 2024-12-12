import { Request, Response } from "express";
import { User } from "../../models";
import { ERROR_NAMES } from "../interfaces/error_interface";

export const verifyPhoneNumber = async (req: Request, res: Response) => {
	const phoneNumber = req.body.phoneNumber
		?.toString()
		.trim()
		.replace(" ", "");
	if (!phoneNumber) {
		return res.status(400).json({
			message: "Invalid phone number",
			name: ERROR_NAMES[400].invalid_phone_number,
			statusCode: 400,
			causes: "",
		});
	}
	try {
		const user = await User.findOne({ where: { phoneNumber } });
		if (!user) {
			return res.status(404).json({
				message: "phone number not found.",
				name: ERROR_NAMES[404].user_not_found,
				statusCode: 404,
				causes: "User with this phone number does not exist.",
			});
		}
		return res.status(200).json(user.getUser());
	} catch (error) {
		return res.status(500).json({
			message: "Internal server error. Try again later.",
			name: ERROR_NAMES[500].internal_server_error,
			statusCode: 500,
			causes: error,
		});
	}
};
