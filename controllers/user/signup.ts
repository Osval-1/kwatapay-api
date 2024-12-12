import { createSecretKey } from "crypto";
import { Request, Response } from "express";
import sequelize, { Account, User } from "../../models";
import { ERROR_NAMES } from "../interfaces/error_interface";
import { generateJWTToken } from "../../utils/generate_jwt_web_token";
import { generatePin, hashText } from "../../utils/secure_password";

export const signup = async (req: Request, res: Response) => {
	const secret = createSecretKey(process.env.SECRET_KEY ?? "", "utf-8");
	const payload = req.body;
	const phoneNumber = payload.phoneNumber?.toString().trim().replace(" ", "");
	if (!payload) {
		return res.status(400).json({
			message: "Invalid request body",
			name: ERROR_NAMES[400].invalid_request_body,
			statusCode: 400,
			causes: "",
		});
	}
	if (!payload.email || !payload.password || !phoneNumber) {
		return res.status(400).json({
			message: "Missing required fields",
			name: ERROR_NAMES[400].missing_required_field,
			statusCode: 400,
			causes: "",
		});
	}
	if (!payload.tag) {
		return res.status(400).json({
			message: "Malformed JSON payload",
			name: ERROR_NAMES[400].missing_required_field,
			statusCode: 400,
			causes: "Missing user tag",
		});
	}
	try {
		const existingUser = await User.findOne({
			where: { email: payload.email },
		});
		if (existingUser) {
			return res.status(400).json({
				message: "Email already in use",
				name: ERROR_NAMES[400].duplicate_email,
				statusCode: 400,
				causes: "",
			});
		}
		const existingPhone = await User.findOne({
			where: { phoneNumber: phoneNumber },
		});
		if (existingPhone) {
			return res.status(400).json({
				message: "Phone number already in use",
				name: ERROR_NAMES[400].duplicate_phone_number,
				statusCode: 400,
				causes: "",
			});
		}
		const t = await sequelize.transaction();
		try {
			const hashedPassword = await hashText(payload.password);
			payload.password = hashedPassword;

			const user = await User.create({ ...payload, phoneNumber });
			const wallet = await Account.create({
				userId: user.get("id"),
				pin: await generatePin(),
				phoneNumber,
				balance: 20000,
			});
			// const user2 = { ...user.get() };
			// delete user2.password;
			generateJWTToken(
				{
					id: user.getDataValue("id"),
					phoneNumber: user.getDataValue("email"),
				},
				secret,
				"1 day",
				"api.kwatapay.com"
			)
				.then((token) => {
					return res.status(200).json({
						token,
						user: user.getUser(),
						walletInfo: wallet.getWalletInfo(),
					});
				})
				.catch((error) => {
					return res.status(400).json({
						message: "Failed to hash password",
						name: ERROR_NAMES[400].invalid_password,
						statusCode: 400,
						causes: error,
					});
				});
			t.commit();
		} catch (error) {
			t.rollback();
			return res.status(400).json({
				message: "Failed to create user",
				name: ERROR_NAMES[400].invalid_request_body,
				statusCode: 400,
				causes: error,
			});
		}
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			message: "Internal server error",
			name: ERROR_NAMES[500].internal_server_error,
			statusCode: 500,
			causes: error,
		});
	}
};
