import { Request, Response } from "express";
import { ERROR_NAMES } from "../interfaces/error_interface";
import sequelize, {
	Account,
	Transaction,
	WithdrawalRequest,
} from "../../models/index";

export const approveWithdrawalRequest = async (req: Request, res: Response) => {
	const requestId = req.body.requestId;
	const approverWalletId = req.body.approverWalletId;
	const approved = req.body.approved; // true | false

	// Validate input parameters
	if (!requestId || !approverWalletId) {
		return res.status(400).json({
			message: "Invalid request parameters",
			name: ERROR_NAMES[400].invalid_request_body,
			statusCode: 400,
			causes: "",
		});
	}

	// Check if the withdrawal request exists
	const withdrawalRequest = await WithdrawalRequest.findByPk(requestId);

	if (!withdrawalRequest) {
		return res.status(404).json({
			message: "Withdrawal request not found",
			name: ERROR_NAMES[404].not_found,
			statusCode: 404,
			causes: "Withdrawal request not found in the system",
		});
	}

	if (withdrawalRequest.getDataValue("resolved")) {
		return res.status(400).json({
			message: "Withdrawal request has already been resolved",
			name: ERROR_NAMES[400].withdrawal_request_already_resolved,
			statusCode: 400,
			causes: "Withdrawal request has already been resolved",
		});
	}

	const trxn = await sequelize.transaction();

	try {
		const transactionId = withdrawalRequest.getDataValue("transactionId");
		const transaction = await Transaction.findByPk(transactionId);

		if (!transaction) {
			return res.status(404).json({
				message: "Transaction not found for this request not found",
				name: ERROR_NAMES[404].not_found,
				statusCode: 404,
				causes: "Transaction not found in the system for this withdrawal request",
			});
		}

		if (!approved) {
			await transaction.update(
				{ status: "cancelled" },
				{ transaction: trxn }
			);
			await withdrawalRequest.update(
				{ resolved: true },
				{ transaction: trxn }
			);
			await trxn.commit();
			// notify initiator and approver
			return res.status(200).json({
				message: "Transaction successfully canceled",
			});
		}

		const amount = Number(transaction.getDataValue("senderAmount"));
		const initiatorId = withdrawalRequest.getDataValue("initiator");
		// Approve the withdrawal request
		const initiatorWallet = await Account.findByPk(initiatorId);
		const approverWallet = await Account.findByPk(approverWalletId);

		await approverWallet?.decrement("balance", {
			by: amount,
			transaction: trxn,
		});
		await initiatorWallet?.increment("balance", {
			by: amount,
			transaction: trxn,
		});
		await withdrawalRequest.update(
			{ resolved: true },
			{ transaction: trxn }
		);
		await transaction.update(
			{ status: "completed" },
			{ transaction: trxn }
		);

		await trxn.commit();

		return res.status(200).json({
			message: "Transaction successfully approved",
		});
	} catch (e) {
		await trxn.rollback();
		return res.status(500).json({
			message: "Error approving withdrawal request",
			name: ERROR_NAMES[500].internal_server_error,
			statusCode: 500,
			causes: e,
		});
	}
};
