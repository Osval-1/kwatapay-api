import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import { createUserTable } from "./users";
import { createAccountTable } from "./accounts";
import { createTransactionsTable } from "./transactions";
import { createPushTokenTable } from "./push_tokens";
import { createWithdrawalRequest } from "./withdrawal_request";

dotenv.config();
const DBURL = process.env.DATABASE_URL

const sequelize = new Sequelize(DBURL as string);

// Create database tables
export const User = createUserTable(sequelize);
export const Account = createAccountTable(sequelize);
export const Transaction = createTransactionsTable(sequelize);
export const PushToken = createPushTokenTable(sequelize);
export const WithdrawalRequest = createWithdrawalRequest(sequelize);

// Associations between tables
User.hasOne(Account, {
	onDelete: "RESTRICT",
	onUpdate: "CASCADE",
	foreignKey: "userId",
});
Account.belongsTo(User, {
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
	foreignKey: "userId",
});

User.hasMany(PushToken, {
	onDelete: "RESTRICT",
	onUpdate: "CASCADE",
	foreignKey: "userId",
});

PushToken.belongsTo(User, {
	foreignKey: "userId",
});

export default sequelize;
