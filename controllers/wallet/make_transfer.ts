import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { Account, Transaction } from "../../models";
import sendPushMessage from "../../services/messaging/send_message";
import { validateWalletPin } from "../../utils/validate_pin";
import { ERROR_NAMES } from "../interfaces/error_interface";
import { ITransaction } from "../interfaces/types";
import { PushToken } from "../../models/index";
import {
	transferRecipientMessageTemplate,
	transferSenderMessageTemplate,
} from "../../utils/message_templates";

export const makeP2PTransfer = async (req: Request, res: Response) => {
	const senderId = req.body.senderId;
	const recipientId = req.body.recipientId;
	// eslint-disable-next-line no-constant-binary-expression
	const amount = Number(req.body.amount) ?? 0;
	const pin = req.body.pin;
	// Validate senderId and recipientId
	const sender = await Account.findByPk(senderId);
	if (!sender) {
		return res.status(404).json({
			message: "Sender account not found",
			name: ERROR_NAMES[404].not_found,
			statusCode: 404,
			causes: "",
		});
	}
	const receiver = await Account.findByPk(recipientId);
	if (!receiver) {
		return res.status(404).json({
			message: "Receiver account not found",
			name: ERROR_NAMES[404].not_found,
			statusCode: 404,
			causes: "",
		});
	}
	if (recipientId === senderId) {
		return res.status(400).json({
			message: "Cannot transfer to the same account",
			name: ERROR_NAMES[400].invalid_request_body,
			statusCode: 400,
			causes: "This happens when the senderId is thesame as the recipientId.",
		});
	}
	if (amount < 1) {
		return res.status(400).json({
			message: "Invalid amount, cannot be less than 1 unit!",
			name: ERROR_NAMES[400].missing_required_field,
			statusCode: 400,
			causes: "",
		});
	}
	// Check if the sender has sufficient balance
	if (sender.getDataValue("balance") < amount) {
		return res.status(400).json({
			message: "Insufficient balance",
			name: ERROR_NAMES[400].insufficient_funds,
			statusCode: 400,
			causes: "",
		});
	}
	// check if pin is valid
	if (!validateWalletPin(pin)) {
		return res.status(400).json({
			message: "Invalid account pin",
			name: ERROR_NAMES[400].invalid_pin,
			statusCode: 400,
			causes: "",
		});
	}

	const senderToken = (
		await PushToken.findOne({
			where: {
				userId: sender.getDataValue("userId"),
			},
		})
	)?.getDataValue("token");
	const recipientToken = (
		await PushToken.findOne({
			where: {
				userId: receiver.getDataValue("userId"),
			},
		})
	)?.getDataValue("token");

	try {
		bcrypt.compare(
			req.body.pin,
			sender.getDataValue("pin"),
			(err, matched) => {
				if (!matched) {
					return res.status(400).json({
						message: "Invalid account pin",
						name: ERROR_NAMES[400].invalid_pin,
						statusCode: 400,
						causes: "",
					});
				} else {
					sender.decrementAmount(amount);
					receiver.incrementAmount(amount);

					const transaction: Partial<ITransaction> = {
						fee: 0,
						externalId: "",
						senderId: sender.getDataValue("id"),
						recipientId: receiver.getDataValue("id"),
						senderAmount: amount,
						recipientAmount: amount,
						senderCurrency: "XAF",
						recipientCurrency: "XAF",
						transactionHash:
							sender.getDataValue("id") +
							receiver.getDataValue("id"),
						method: "P2P",
						timestamp: new Date(),
						status: "completed",
						type: "transfer",
					};
					Transaction.create(transaction)
						.then((value) => {
							const messageToSender =
								transferSenderMessageTemplate(
									senderId,
									recipientId,
									"N/A",
									amount,
									value.getDataValue("id"),
									sender.getDataValue("balance"),
									transaction.createdAt ?? Date()
								);

							const messageToRecipient =
								transferRecipientMessageTemplate(
									senderId,
									sender.getDataValue("id"),
									amount,
									transaction.createdAt ?? Date()
								);

							senderToken &&
								sendPushMessage([senderToken], messageToSender);
							recipientToken &&
								sendPushMessage(
									[recipientToken],
									messageToRecipient
								);

							return res.status(200).json({
								...value.get(),
								newBalance: sender.getDataValue("balance"),
							});
						})
						.catch((err) => {
							return res.status(500).json({
								message: "Internal server error",
								name: ERROR_NAMES[500].internal_server_error,
								statusCode: 500,
								causes: err,
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
