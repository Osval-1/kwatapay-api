import { Request, Response } from "express";
import { PushToken, User } from "../../models";
import { ERROR_NAMES } from "../interfaces/error_interface";
import Expo from "expo-server-sdk";

export const savePushToken = async (req: Request, res: Response) => {
	const userId = req.body.userId;
	const pushToken = req.body.pushToken;

	if (!userId || !pushToken) {
		return res.status(400).json({
			message: "Invalid request body",
			name: ERROR_NAMES[400].invalid_request_body,
			statusCode: 400,
			causes: "All fields are required. userId should be a valid uuid string. Push token shold be a valid expo pushtoken",
		});
	}

	const user = await User.findOne({ where: { id: userId } });
	if (!user) {
		return res.status(404).json({
			message: "User not found",
			statusCode: 404,
			name: ERROR_NAMES[404].user_not_found,
			causes: "",
		});
	}

	const isValid = Expo.isExpoPushToken(pushToken);
	if (!isValid) {
		res.status(400).json({
			message: "Invalid push token",
			name: ERROR_NAMES[400].invalid_push_token,
		});
	}

	try {
		const token = await PushToken.create({ token: pushToken, userId });
		return res.status(201).json(token);
	} catch (err) {
		return res.status(500).json({
			message: "Error saving push token",
			name: ERROR_NAMES[500].internal_server_error,
			statusCode: 500,
			causes: err,
		});
	}
};
