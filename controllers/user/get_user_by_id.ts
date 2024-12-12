import { Request, Response } from "express";
import { User } from "../../models";
import { ERROR_NAMES } from "../interfaces/error_interface";

export const getUserById = async (req: Request, res: Response) => {
	const userId = req.params.id;
	try {
		const user = await User.findByPk(userId, {
			attributes: { exclude: ["password"] },
		});
		if (!user) {
			return res.status(404).json({
				message: "user not found",
				name: ERROR_NAMES[404].user_not_found,
				statusCode: 404,
				causes: "",
			});
		}
		return res.status(200).json(user.getUser());
	} catch (err) {
		return res.status(500).json({
			message: "Internal server error",
			name: ERROR_NAMES[500].internal_server_error,
			statusCode: 500,
			causes: err,
		});
	}
};
