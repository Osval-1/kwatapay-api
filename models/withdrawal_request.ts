import { Model, DataTypes, Sequelize } from "sequelize";

export const createWithdrawalRequest = (sequelize: Sequelize) => {
	class WithdrawalRequest extends Model {
		getRequestInfo() {
			return {
				id: this.getDataValue("id"),
				transactionId: this.getDataValue("transactionId"),
				initiator: this.getDataValue("initiator"),
				approver: this.getDataValue("approver"),
				resolved: this.getDataValue("resolved"),
			};
		}
	}
	WithdrawalRequest.init(
		{
			id: {
				type: DataTypes.UUID,
				allowNull: false,
				primaryKey: true,
				defaultValue: DataTypes.UUIDV4,
			},
			transactionId: {
				type: DataTypes.UUID,
				allowNull: false,
				unique: true,
			},
			initiator: {
				type: DataTypes.UUID,
				allowNull: false,
			},
			approver: {
				type: DataTypes.UUID,
				allowNull: false,
			},
			resolved: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
				allowNull: false,
			},
		},
		{ sequelize, tableName: "withdrawal_requests", timestamps: true }
	);
	return WithdrawalRequest;
};
