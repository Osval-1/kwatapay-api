import { Request, Response } from "express";
import { Account, Transaction } from "../../models";
import { ERROR_NAMES } from "../interfaces/error_interface";
import { Op } from "sequelize";

export const getAllTransactionsByWalletId = async (
	req: Request,
	res: Response
) => {
	const query = req.query;

	const walletId = req.query.walletId as string;
	try {
		const wallet = await Account.findByPk(walletId);

		if (!wallet) {
			return res.status(404).json({
				message: "Account not found",
				name: ERROR_NAMES[404].not_found,
				statusCode: 404,
				causes: "User with id not found or account with walletId in request body not found.",
			});
		}
		const transactions = await Transaction.findAll({
			where: {
				[Op.or]: [
					{ senderId: wallet.getDataValue("id") },
					{ recipientId: wallet.getDataValue("id") },
				],
			},
			order: [["updatedAt", "DESC"]],
			offset: Number(query.offset || 0),
			limit: Number(query.limit || 50),
		});

		return res.status(200).json(transactions);
	} catch (error) {
		return res.status(500).json({
			message: "Internal server error",
			name: ERROR_NAMES[500].internal_server_error,
			statusCode: 500,
			causes: error,
		});
	}
};
