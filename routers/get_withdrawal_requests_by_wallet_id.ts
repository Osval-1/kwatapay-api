import { Request, Response } from "express";
import { Account, User, WithdrawalRequest } from "../models";
import { Op } from "sequelize";
import { Transaction } from "../models/index";
import { ERROR_NAMES } from "../controllers/interfaces/error_interface";

export const getWithdrawalRequestsByWalletId = async (
	req: Request,
	res: Response
) => {
	const walletId = req.params.walletId as string;
	if (!walletId) {
		return res.status(400).json({
			message: "Invalid walletId",
			name: ERROR_NAMES[404].resource_not_found,
			statusCode: 400,
			causes: "WalletId is required",
		});
	}
	try {
		const withdrawalRequests = await WithdrawalRequest.findAll({
			where: { approver: walletId, resolved: false },
		});

		const formatted: any[] = [];

		for (let request of withdrawalRequests) {
			const transaction = await Transaction.findByPk(
				request.getDataValue("transactionId")
			);
			const initiatorWallet = await Account.findByPk(
				request.getDataValue("initiator")
			);

			const initiatorUserInfo = await User.findByPk(
				initiatorWallet?.getDataValue("userId")
			);

			formatted.push({
				...request.get(),
				transaction: transaction?.get(),
				user: initiatorUserInfo?.getUser(),
			});
		}
		return res.status(200).json(formatted);
	} catch (error) {
		return res.status(500).json({
			message: "Internal server error",
			name: ERROR_NAMES[500].internal_server_error,
			statusCode: 500,
			causes: error,
		});
	}
};
