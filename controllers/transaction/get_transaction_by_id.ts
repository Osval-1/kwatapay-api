import { Request, Response } from "express";
import { ERROR_NAMES } from "../interfaces/error_interface";
import { Transaction } from "../../models";

export const getTransactionById = async (req: Request, res: Response) => {
	const transactionId = req.params.id;
	if (!transactionId) {
		return res.status(404).json({
			message: "Transaction not found",
			name: ERROR_NAMES[404].not_found,
			statusCode: 404,
			causes: "The transaction with id " + transactionId + " not found.",
		});
	}
	// Implement logic to fetch transaction data from the database and return it
	try {
		const transaction = await Transaction.findByPk(transactionId);
		if (!transaction) {
			return res.status(404).json({
				message: "Transaction not found",
				name: ERROR_NAMES[404].not_found,
				statusCode: 404,
				causes:
					"The transaction with id " + transactionId + " not found.",
			});
		}
		return res.status(200).json(transaction);
	} catch (error) {
		return res.status(500).json({
			message: "Internal server error",
			name: ERROR_NAMES[500].internal_server_error,
			statusCode: 500,
			causes: error,
		});
	}
};