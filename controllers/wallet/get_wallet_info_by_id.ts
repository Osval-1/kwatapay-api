import { Request, Response } from "express";
import { Account, Transaction } from "../../models";
import { ERROR_NAMES } from "../interfaces/error_interface";
import { Op } from "sequelize";
export const getWalletInformationById = async (req: Request, res: Response) => {
	const walletId = req.params.id;
	// Implement logic to fetch wallet information by id
	if (!walletId) {
		return res.status(400).json({
			name: ERROR_NAMES[404].resource_not_found,
			message: "wallet not found",
			statusCode: 404,
			causes: "",
		});
	}
	try {
		const wallet = await Account.findByPk(walletId);
		if (!wallet) {
			return res.status(404).json({
				message: "Wallet not found",
				name: ERROR_NAMES[404].resource_not_found,
				statusCode: 404,
				causes: "",
			});
		}
		const transactions = await Transaction.findAll({
			offset: 0,
			limit: 10,
			order: [["updatedAt", "DESC"]],
			where: {
				[Op.or]: [
					{ senderId: wallet.get("id") },
					{ recipientId: wallet.get("id") },
				],
			},
		});
		return res
			.status(200)
			.json({ ...wallet.getWalletInfo(), transactions: transactions });
	} catch (error) {
		return res.status(500).json({
			message: "Internal server error",
			name: ERROR_NAMES[500].internal_server_error,
			statusCode: 500,
			causes: error,
		});
	}
};
