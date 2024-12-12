import { Request, Response } from "express";
import { ERROR_NAMES } from "../interfaces/error_interface";
import { Account, User } from "../../models";
import bcrypt from "bcrypt";
import { generateJWTToken } from "../../utils/generate_jwt_web_token";
import { createSecretKey } from "crypto";

export const signin = async (req: Request, res: Response) => {
	const payload = req.body;
	if (!payload) {
		return res.status(400).json({
			message: "Invalid request body",
			name: ERROR_NAMES[400].invalid_request_body,
			statusCode: 400,
			causes: "",
		});
	}
	if (!payload.phoneNumber || !payload.password) {
		return res.status(400).json({
			message: "Missing required fields",
			name: ERROR_NAMES[400].missing_required_field,
			statusCode: 400,
			causes: "This error occurred ",
		});
	} else {
		try {
			// validate email and password
			const user = await User.findOne({
				where: { phoneNumber: payload.phoneNumber },
			});
			if (!user) {
				return res.status(404).json({
					message: "Phone number not found",
					name: ERROR_NAMES[400].invalid_password,
					statusCode: 404,
					causes: "",
				});
			}

			const walletInfo = await Account.findOne({
				where: { userId: user.getDataValue("id") ?? "" },
			});

			bcrypt.compare(
				payload.password,
				user.getDataValue("password"),
				(err, matched) => {
					if (err) {
						console.error(err);
						return res.status(500).json({
							message: "Internal server error",
							name: ERROR_NAMES[500].internal_server_error,
							statusCode: 500,
							causes: err,
						});
					}

					if (matched) {
						const secret = createSecretKey(
							process.env.JWT_SECRET ?? "",
							"utf-8"
						);

						generateJWTToken(
							{
								id: user.getDataValue("id"),
								phoneNumber: user.getDataValue("phoneNumber"),
							},
							secret,
							"1 day",
							"api.kwatapay.com"
						).then((token) => {
							return res.status(200).json({
								user: user.getUser(),
								token,
								walletInfo: walletInfo?.getWalletInfo(),
							});
						});
					} else {
						return res.status(400).json({
							message: "Invalid credentials",
							name: ERROR_NAMES[400].invalid_credentials,
							statusCode: 400,
							causes: "",
						});
					}
				}
			);
		} catch (error) {
			return res.status(500).json({
				message: "Internal server error",
				name: ERROR_NAMES[500].internal_server_error,
				statusCode: 500,
				causes: error,
			});
		}
	}
};
