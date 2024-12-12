import { Request, Response } from "express";
import { ERROR_NAMES } from "../interfaces/error_interface";
import sequelize, {
	Account,
	PushToken,
	Transaction,
	User,
	WithdrawalRequest,
} from "../../models";
import { ITransaction } from "../interfaces/types";
import sendPushMessage from "../../services/messaging/send_message";

export const initiateWithdrawal = async (req: Request, res: Response) => {
	const payersWalletId = req.body.payerWalletId;
	const amount = Number(req.body.amount);
	const userId = req.body.userId;
	const initiatorWalletId = req.body.initiatorWalletId;
	const message = req.body.message;

	// Validate input parameters
	if (!payersWalletId || !amount || !userId || !initiatorWalletId) {
		return res.status(400).json({
			message: "Invalid request body",
			name: ERROR_NAMES[400].invalid_request_body,
			statusCode: 400,
			causes: "Missing required fields: walletId, amount, userId, and message",
		});
	}

	if (payersWalletId === initiatorWalletId) {
		return res.status(400).json({
			message: "Invalid request body",
			name: ERROR_NAMES[400].invalid_request_body,
			statusCode: 400,
			causes: "Payer's wallet id cannot be the same as the initiator's wallet id",
		});
	}

	const trxn = await sequelize.transaction();
	try {
		const user = await User.findByPk(userId);
		if (!user) {
			return res.status(404).json({
				message: "User not found",
				name: ERROR_NAMES[404].user_not_found,
				statusCode: 404,
				causes: "User with id not found",
			});
		}

		const initiatorVallet = await Account.findByPk(initiatorWalletId);
		if (!initiatorVallet) {
			return res.status(404).json({
				message: "Initiator's wallet not found",
				name: ERROR_NAMES[404].not_found,
				statusCode: 404,
				causes: "Initiator's wallet not found in the system",
			});
		}

		if (initiatorVallet.getDataValue("userId") !== userId) {
			return res.status(401).json({
				message: "Mismatched userId",
				name: ERROR_NAMES[401].unauthorized,
				statusCode: 401,
				causes: "User not authorized to initiate this transaction. User must own this wallet with id provided in the payload",
			});
		}

		const payerWallet = await Account.findByPk(payersWalletId);
		if (!payerWallet) {
			return res.status(404).json({
				message: "Payer's wallet not found",
				name: ERROR_NAMES[404].not_found,
				statusCode: 404,
				causes: "Payer's wallet not found in the system",
			});
		}

		if (payerWallet.getDataValue("balance") < amount) {
			return res.status(400).json({
				message: "Insufficient balance for this transaction",
				name: ERROR_NAMES[400].insufficient_funds,
				statusCode: 400,
				causes: "Insufficient balance in the approver's wallet",
			});
		}
		// Create a transaction record
		const transaction: Partial<ITransaction> = {
			fee: 0,
			externalId: "",
			senderId: payerWallet.getDataValue("id"),
			recipientId: initiatorVallet.getDataValue("id"),
			senderAmount: amount,
			recipientAmount: amount,
			senderCurrency: "XAF",
			recipientCurrency: "XAF",
			transactionHash: initiatorWalletId + payersWalletId,
			method: "P2P",
			timestamp: new Date(),
			status: "pending",
			type: "cashout",
		};
		const newTransaction = await Transaction.create(transaction, {
			transaction: trxn,
		});

		// Create a Withdrawal Request record
		const withdrawalRequest = await WithdrawalRequest.create(
			{
				transactionId: newTransaction.getDataValue("id"),
				initiator: initiatorVallet.getDataValue("id"),
				approver: payerWallet.getDataValue("id"),
				resolved: false,
			},
			{ transaction: trxn }
		);

		trxn.commit();

		return res.status(201).json(withdrawalRequest.getRequestInfo());
	} catch (err) {
		trxn.rollback();
		return res.status(500).json({
			message:
				"Internal server error occurred while processing the request",
			name: ERROR_NAMES[500].internal_server_error,
			statusCode: 500,
			causes: err,
		});
	}

	// Perform withdrawal logic
};
