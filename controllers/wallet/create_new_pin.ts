import { Request, Response } from "express";
import { ERROR_NAMES } from "../interfaces/error_interface";
import { Account } from "../../models";
import { hashText } from "../../utils/secure_password";
import { validateWalletPin } from "../../utils/validate_pin";

export const createWalletPin = async (req: Request, res: Response) => {
	const walletId = req.body.walletId;
	const newPin = req.body.pin.replace(/\D/g, "");

	if (!walletId || !newPin) {
		return res.status(400).json({
			message: "Invalid request parameters",
			name: ERROR_NAMES[400].invalid_request_body,
			statusCode: 400,
			causes: "",
		});
	}

	if (!validateWalletPin(newPin)) {
		return res.status(400).json({
			message: "Invalid account pin",
			name: ERROR_NAMES[400].invalid_pin,
			causes: "The pin code is either less than 6 or greater than 6. Make sure that the pin code does not contain non-numeric characters.",
			statusCode: 400,
		});
	}

	try {
		const account = await Account.findByPk(walletId);
		if (!account || account.get("userId") !== req.body.userId) {
			return res.status(404).json({
				message: "Account not found",
				name: ERROR_NAMES[404].not_found,
				statusCode: 404,
				causes: "User with id not found or account with walletId in request body not found.",
			});
		}
		account.setDataValue("pin", await hashText(newPin)); // update pin
		account
			.save()
			.then(() => {
				return res
					.status(200)
					.json({ message: "Pin updated successfully" });
			})
			.catch((error) => {
				console.error(error);
				return res.status(500).json({
					message:
						"Internal server error while updating account pin. Unable to update account pin.",
					name: ERROR_NAMES[500].internal_server_error,
					statusCode: 500,
					causes: error,
				});
			});
	} catch (error) {
		return res.status(500).json({
			message:
				"Internal server error while creating account pin. Try again later",
			name: ERROR_NAMES[500].internal_server_error,
			statusCode: 500,
			causes: error,
		});
	}
};