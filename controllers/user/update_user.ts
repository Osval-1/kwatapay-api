import { Request, Response } from "express";
import { User } from "../../models";
import { ERROR_NAMES } from "../interfaces/error_interface";
import validateUrl from "../../utils/validate_url";

export const updateUserById = async (req: Request, res: Response) => {
	const userId = req.params.id;
	const payload = req.body;

	if (!payload) {
		return res.status(400).json({
			message: "Invalid request body",
			name: ERROR_NAMES[400].invalid_request_body,
			statusCode: 400,
			causes: "",
		});
	}

	const user = await User.findByPk(userId ?? "", {
		attributes: {
			exclude: ["createdAt", "updatedAt", "password", "profileImageUrl"],
		},
	});
	if (!user) {
		return res.status(404).json({
			message: "User not found",
			name: ERROR_NAMES[404].user_not_found,
			statusCode: 404,
			causes: "",
		});
	}
	try {
		const updated = await user.update({
			firstName: payload.firstName,
			lastName: payload.lastName,
			email: payload.email,
			phoneNumber: payload.phoneNumber,
		});
		return res.status(200).json(updated.getUser());
	} catch (error) {
		return res.status(500).json({
			message: "Internal server error",
			name: ERROR_NAMES[500].internal_server_error,
			statusCode: 500,
			causes: error,
		});
	}
};

export const updateProfileImage = async (req: Request, res: Response) => {
	const userId = req.params.id;
	const payload = req.body;

	if (!validateUrl(payload.profileImageUrl)) {
		return res.status(400).json({
			message: "Invalid request body",
			name: ERROR_NAMES[400].invalid_request_body,
			statusCode: 400,
			causes: "The profileImageUrl field in request body is required.",
		});
	}

	const user = await User.findByPk(userId ?? "");
	if (!user) {
		return res.status(404).json({
			message: "User not found",
			name: ERROR_NAMES[404].user_not_found,
			statusCode: 404,
			causes: "",
		});
	}
	try {
		const updated = await user.update({
			profileImageUrl: payload.profileImageUrl,
		});
		return res.status(200).json(updated.getUser());
	} catch (error) {
		return res.status(500).json({
			message: "Internal server error",
			name: ERROR_NAMES[500].internal_server_error,
			statusCode: 500,
			causes: error,
		});
	}
};