import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { Account, PushToken, Transaction } from "../../models";
import { ERROR_NAMES } from "../interfaces/error_interface";
import { validateWalletPin } from "../../utils/validate_pin";
import { ITransaction } from "../interfaces/types";
import { withdrawalMessageTemplate } from "../../utils/message_templates";
import sendPushMessage from "../../services/messaging/send_message";

export const withdrawFromWallet = async (req: Request, res: Response) => {
	const amount = Number(req.body.amount);
	const to = req.body.to;
	const userId = req.body.userId;
	const pin = req.body.pin;
	const walletId = req.body.walletId;
	const method = req.body.method;

	// Implement logic to withdraw the specified amount from the user's wallet
	// Example: Update the user's wallet balance and log the transaction

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
			causes: "Pin is required for withdrawal.",
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
					if (
						amount <= 0 ||
						amount > Number(account.getDataValue("balance"))
					) {
						return res.status(400).json({
							message: "Invalid amount provided",
							name: ERROR_NAMES[400].invalid_request_body,
							statusCode: 400,
							causes: "You account balance is insufficient to make this transaction",
						});
					}
					if (amount > account.getDataValue("amount")) {
						return res.status(400).json({
							message: "Insufficient funds",
							name: ERROR_NAMES[400].insufficient_funds,
							statusCode: 400,
							causes: "Insufficient funds in the wallet.",
						});
					}

					if (!(method === "MOMO" || method === "OM")) {
						return res.status(400).json({
							message: "Invalid topup method provided",
							name: ERROR_NAMES[400].invalid_request_body,
							statusCode: 400,
							causes: "Topup method should be either MOMO or OM",
						});
					}
					// increment user wallet on success
					account.decrementAmount(amount);
					// TODO
					// get withrawal method, CASHIN to their withrawal number
					const transaction: Partial<ITransaction> = {
						status: "completed",
						type: "withdrawal",
						transactionHash: account.getDataValue("id"),
						fee: 0,
						description: "Withdrawal to recipient",
						externalId: to,
						senderId: account.getDataValue("id"),
						recipientId: "",
						senderAmount: amount,
						senderCurrency: "XAF",
						recipientCurrency: "XAF",
						method,
						timestamp: new Date(),
					};
					Transaction.create(transaction)
						.then((value) => {
							const createAt = new Date(
								value.getDataValue("createdAt")
							);
							const fee = value.getDataValue("fee");
							const transactionId = value.getDataValue("id");
							const balance = account.getDataValue("balance");
							const message = withdrawalMessageTemplate(
								amount,
								walletId,
								to,
								createAt.toLocaleString(),
								fee ?? 0,
								transactionId,
								balance
							);
							sendPushMessage([pushToken], message);
							return res.status(200).json({
								...value.get(),
								newBalance: account.getDataValue("balance"),
							});
						})
						.catch((error) => {
							console.error(error);
							return res.status(500).json({
								message:
									"Internal server error while creating transaction",
								name: ERROR_NAMES[500].internal_server_error,
								statusCode: 500,
								causes: error,
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
};
