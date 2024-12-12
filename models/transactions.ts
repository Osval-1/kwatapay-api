import { Model, DataTypes, Sequelize } from "sequelize";

export const createTransactionsTable = (sequelize: Sequelize) => {
	class Transaction extends Model {}

	Transaction.init(
		{
			id: {
				type: DataTypes.UUID,
				allowNull: false,
				primaryKey: true,
				defaultValue: DataTypes.UUIDV4,
			},
			transactionHash: {
				type: DataTypes.STRING,
				allowNull: false,
				field: "transaction_hash",
			},
			status: {
				type: DataTypes.ENUM(
					"completed",
					"failed",
					"pending",
					"cancelled"
				),
				allowNull: false,
			},
			type: {
				type: DataTypes.ENUM(
					"deposit",
					"withdrawal",
					"transfer",
					"cashout"
				),
				allowNull: false,
			},
			fee: {
				type: DataTypes.FLOAT,
				allowNull: false,
				defaultValue: 0.0,
			},
			externalId: { type: DataTypes.STRING, field: "external_id" },
			description: DataTypes.STRING,
			senderId: {
				type: DataTypes.STRING,
				field: "sender_id",
			},
			recipientId: { type: DataTypes.STRING, field: "recipient_id" },
			recipientAmount: {
				type: DataTypes.FLOAT,
				field: "recipient_amount",
			},
			senderAmount: {
				type: DataTypes.FLOAT,
				field: "sender_amount",
			},
			senderCurrency: {
				type: DataTypes.STRING,
				field: "sender_currency",
				allowNull: false,
				defaultValue: "XAF",
			},
			recipientCurrency: {
				type: DataTypes.STRING,
				field: "recipient_currency",
				allowNull: false,
				defaultValue: "XAF",
			},
			method: DataTypes.STRING,
			timestamp: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW,
			},
		},
		{ sequelize, tableName: "transactions", timestamps: true }
	);
	return Transaction;
};
