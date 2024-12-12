import { Model, DataTypes, Sequelize } from "sequelize";
export const createAccountTable = (sequelize: Sequelize) => {
	class Account extends Model {
		incrementAmount(amount: number) {
			this.setDataValue("balance", this.getDataValue("balance") + amount);
			this.save();
		}
		decrementAmount(amount: number) {
			this.setDataValue("balance", this.getDataValue("balance") - amount);
			this.save();
		}
		getWalletInfo() {
			return {
				id: this.getDataValue("id"),
				topupAccounts: this.getDataValue("topupAccounts"),
				balance: this.getDataValue("balance"),
				userId: this.getDataValue("userId"),
				type: this.getDataValue("type"),
			};
		}
	}

	Account.init(
		{
			id: {
				type: DataTypes.UUID,
				allowNull: false,
				primaryKey: true,
				defaultValue: DataTypes.UUIDV4,
			},
			topupAccounts: {
				type: DataTypes.ARRAY(DataTypes.STRING),
				defaultValue: [],
				allowNull: false,
			},
			balance: {
				type: DataTypes.FLOAT,
				allowNull: false,
				defaultValue: 0,
			},
			userId: {
				type: DataTypes.UUID,
				references: {
					model: "users",
					key: "id",
				},
				allowNull: false,
			},
			pin: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					isLength: 5,
				},
			},
			type: {
				type: DataTypes.ENUM("normal", "business"),
				defaultValue: "normal",
				allowNull: false,
			},
		},
		{ sequelize, tableName: "accounts", timestamps: true }
	);
	return Account;
};
