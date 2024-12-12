import express from "express";
import dotenv from "dotenv";
import sequelize from "./models/index";
import cors from "cors";
import userRoutes from "./routers/user_routes";
import transactionRoutes from "./routers/transactions_routes";
import authRoutes from "./routers/auth_routes";
import walletRoutes from "./routers/wallet_routes";
import messagingRoutes from "./routers/messaging_routes";

dotenv.config();
const port = process.env.LISTENPORT || 3000;

const app = express();
sequelize
	.authenticate()
	.then(() => {
		console.log(
			`{message: database connection established, timestamp: ${Date.now()}}`
		);
		app.listen(port, () =>
			console.log(
				`{message: Server running, port: ${port}, timestamp: ${Date.now()}}`
			)
		);
	})
	.catch(() => {
		console.error("Unable to connect to the database!");
		process.exit(1);
	});
sequelize.sync({
	alter: {
		drop: false,
	},
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/transactions", transactionRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/wallet", walletRoutes);
app.use("/api/v1/messages", messagingRoutes);
app.get("/ping", (req, res) => {
	res.send("Pong :)!");
});
