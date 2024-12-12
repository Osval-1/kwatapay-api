import { NextFunction, Request, Response } from "express";
import { ERROR_NAMES } from "../controllers/interfaces/error_interface";
import { User } from "../models";

export const generateUserTagMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const payload = req.body;

	if (!payload) {
		return res.status(400).json({
			name: ERROR_NAMES[400].invalid_request_body,
			message: "Invalid request body",
			statusCode: 400,
			causes: "",
		});
	}
	// Trim, remove words
	const trimmed = String(
		payload.firstName.toString().replace(/\W/g, "")
	).toLowerCase();
	if (!trimmed) {
		return res.status(400).json({
			name: ERROR_NAMES[400].invalid_request_body,
			message: "Invalid request body",
			statusCode: 400,
			causes: "The first name field cannot be empty",
		});
	}

	try {
		const collisions = (
			await User.findAll({
				where: { firstName: trimmed },
			})
		).length;
		if (collisions > 0) {
			req.body = {
				...payload,
				tag: "kp-" + trimmed + (collisions + 1).toPrecision(3),
			};
			return next();
		}
		if (trimmed.length < 5) {
			req.body = {
				...payload,
				tag: "kp-" + trimmed + (collisions + 1).toPrecision(4),
			};
			return next();
		}
		req.body = { ...payload, tag: "kp-" + trimmed };
		return next();
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			message: "Failed to validate payload",
			name: ERROR_NAMES[500].internal_server_error,
			statusCode: 500,
			causes: error,
		});
	}
};
