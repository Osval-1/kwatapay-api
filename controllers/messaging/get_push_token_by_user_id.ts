import { Request, Response } from "express";
import { PushToken } from "../../models";
import { ERROR_NAMES } from "../interfaces/error_interface";

export const getPushTokensByUserId = async (req: Request, res: Response) => {
	const userId = req.params.userId;

	// Fetch push token from database based on userId
	try {
		const pushTokens = await PushToken.findAll({ where: { userId } });
		if (!pushTokens) {
			return res.status(404).json({
				message: "No push tokens found for user " + userId,
				name: ERROR_NAMES[404].not_found,
				statusCode: 404,
			});
		}

		return res
			.status(200)
			.json(
				pushTokens.map((pushToken) => pushToken.getDataValue("token"))
			);
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			message: "Error fetching push token",
			name: ERROR_NAMES[500].internal_server_error,
			statusCode: 500,
		});
	}
};
