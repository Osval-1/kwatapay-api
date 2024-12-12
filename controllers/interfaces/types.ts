export interface ITransaction {
	id: string;
	transactionHash: string;
	status: "completed" | "failed" | "pending" | "canceled";
	type: "deposit" | "withdrawal" | "transfer" | "cashout";
	fee: number;
	description?: string;
	externalId?: string;
	senderId?: string;
	recipientId?: string;
	recipientAmount?: number;
	senderAmount?: number;
	senderCurrency?: string;
	recipientCurrency?: string;
	method: string;
	timestamp: Date;
	createdAt: string;
	updatedAt: string;
}
