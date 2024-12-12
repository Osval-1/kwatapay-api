import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import { createUserTable } from "./users";
import { createAccountTable } from "./accounts";
import { createTransactionsTable } from "./transactions";
import { createPushTokenTable } from "./push_tokens";
import { createWithdrawalRequest } from "./withdrawal_request";

dotenv.config();
const DBUSER = process.env.DBUSER;
const DBPASSWORD = process.env.DBPASSWORD;
const DBNAME = process.env.DBNAME;
const DBHOST = process.env.DBHOST;

const DB_PATH = `postgresql://postgres:LqXkiXsykvdrEgzMRKCyRMmmVzZaBUCX@junction.proxy.rlwy.net:47331/railway`;
// const DB_PATH = `postgresql://${DBUSER}:${DBPASSWORD}@${DBHOST}/${DBNAME}?ssl=true`;
const sequelize = new Sequelize(DB_PATH);

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
