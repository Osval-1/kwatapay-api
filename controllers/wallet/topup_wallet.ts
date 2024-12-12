import { Request, Response } from "express";
import { Account, PushToken, Transaction } from "../../models";
import { ERROR_NAMES } from "../interfaces/error_interface";
import { validateWalletPin } from "../../utils/validate_pin";
import bcrypt from "bcrypt";
import { ITransaction } from "../interfaces/types";
import sendPushMessage from "../../services/messaging/send_message";
import { topupWalletMessageTemplate } from "../../utils/message_templates";

export const topupWallet = async (req: Request, res: Response) => {
	const userId = req.body.userId;
	const amount = Number(req.body.amount);
	const method = req.body.method;
	const externalId = req.body.externalId;
	const walletId = req.body.walletId;
	const pin = Number(req.body.pin);

	// Validate input parameters

	// Implement logic to top up the wallet of the specified user by the given amount
	// Example: Update the user's wallet balance and log the transaction
	// Topupwallet is the process of adding funds to the wallet.
	// It requires walletId, userId, amount, method of topup, and the unique identifier of external account. eg momo number or orange number.
	// In the case of topping up through a bank, bank account details will be required.

	const account = await Account.findByPk(walletId);

	if (!account || account.get("userId") !== userId) {
		return res.status(404).json({
			message: "Account not found",
			name: ERROR_NAMES[404].not_found,
			statusCode: 404,
			causes: "User with id not found or account with walletId in request body not found.",
		});
	}

	if (!validateWalletPin(pin)) {
		return res.status(400).json({
			message: "Invalid transaction pin.",
			name: ERROR_NAMES[400].invalid_pin,
			statusCode: 400,
			causes: "Pin is required for top-up.",
		});
	}

	const pushToken = (
		await PushToken.findOne({ where: { userId } })
	)?.getDataValue("token");

	try {
		bcrypt.compare(
			req.body.pin,
			account.getDataValue("pin"),
			(err, matched) => {
				if (!matched) {
					return res.status(400).json({
						message: "Invalid account pin",
						name: ERROR_NAMES[400].invalid_pin,
						statusCode: 400,
						causes: "",
					});
				} else {
					if (amount <= 0) {
						return res.status(400).json({
							message: "Invalid amount provided",
							name: ERROR_NAMES[400].invalid_request_body,
							statusCode: 400,
							causes: "",
						});
					}

					if (method !== "MOMO" && method !== "OM") {
						return res.status(400).json({
							message: "Invalid topup method provided",
							name: ERROR_NAMES[400].invalid_request_body,
							statusCode: 400,
							causes: "Topup method should be either MOMO or OM",
						});
					}

					account.incrementAmount(amount);
					const transaction: Partial<ITransaction> = {
						timestamp: new Date(),
						description: "Topup from external account",
						externalId,
						transactionHash: account.getDataValue("id") ?? "",
						method,
						senderId: "",
						recipientId: account.getDataValue("id"),
						senderAmount: amount,
						fee: 0,
						senderCurrency: "XAF",
						recipientCurrency: "XAF",
						status: "completed",
						type: "deposit",
					};
					Transaction.create(transaction).then((value) => {
						const balance = account.getDataValue("balance");
						const walletId = account.getDataValue("id");
						const fee = account.getDataValue("fee");
						const transactionId = value.getDataValue("id");
						const createdAt = new Date(
							value.getDataValue("createdAt")
						);

						const message = topupWalletMessageTemplate(
							amount,
							externalId,
							walletId,
							createdAt.toLocaleString(),
							fee ?? 0,
							transactionId ?? "",
							balance
						);
						sendPushMessage([pushToken], message);
						return res.status(200).json({
							newBalance: balance,
							...value.get(),
						});
					});
				}
			}
		);
	} catch (err) {
		return res.status(500).json({
			message: "Internal server error",
			name: ERROR_NAMES[500].internal_server_error,
			statusCode: 500,
			causes: err,
		});
	}
};/////;
