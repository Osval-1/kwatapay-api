export const transferSenderMessageTemplate = (
	sendWalletId: string,
	recipientWalletId: string,
	recipientTag: string,
	amount: number | string,
	transactionId: string,
	balance: number | string,
	datetime: string | Date | number,
	transactionFee?: number | string
) => {
	return `You have sucesssfully transferred ${amount} XAF from your mobile wallet (${sendWalletId}) to ${recipientTag} (${recipientWalletId}) at ${datetime}. Transaction id ${transactionId}. Transfer fee: ${
		transactionFee ?? 0
	} XAF. Current balance: ${balance} XAF. Thanks for trusting Kwatapay!
    `;
};

export const transferRecipientMessageTemplate = (
	senderWalletId: string,
	senderTag: string,
	amount: number | string,
	datetime: string | Date | number
) => {
	return `You have received ${amount} from ${senderTag} (${senderWalletId}) into your mobile wallet at ${datetime}. Transaction Id: <transactionId> at <datetime>. Your new balance is <balance>. Send and receive money from your love ones with ease on Kwatapay mobile!
        `;
};

export const topupWalletMessageTemplate = (
	amount: number,
	phoneNumber: string,
	walletId: string,
	datetime: string,
	fee: number,
	transactionId: string,
	balance: number
) => {
	return `You have successfully transfered ${amount} XAF from your topup account (${phoneNumber})  into your mobile wallet ${walletId} at ${datetime}. Fee: ${fee}. Transaction Id: ${transactionId}. Your new balance is ${balance} XAF. Thanks for trusting Kwatapay!
    `;
};

export const withdrawalMessageTemplate = (
	amount: number,
	walletId: string,
	toPhoneNumber: string,
	datetime: string,
	fee: number,
	transactionId: string,
	balance: number
) => {
	return `You have successfully withdrawn ${amount} XAF from your mobile wallet ${walletId} into your mobile number ${toPhoneNumber} at ${datetime}. Fee: ${fee}. Transaction Id: ${transactionId}. Your new balance is ${balance} XAF. Thanks for trusting Kwatapay!
    `;
};


export const transferInitiatedMessageToIniatorTemplate = () => {
	return `
	Your request to receive money from wallet was successfully initiated.
	Please check your messages or app for the details. If you have any questions, please reach out to our support team at <support_email>.`;
};

export const transferInitiatedMessageToRecipientTemplate = () => {
	return `
    A transfer has been initiated from your mobile wallet. Please check your messages or app for the details. If you have any questions, please reach out to our support team at <support_email>.
    `;
};

export const transferCanceledMessageToIniatorTemplate = () => {
	return `
    Your request to receive money from wallet was canceled.
    Please check your messages or app for the details. If you have any questions, please reach out to our support team at <support_email>.`;
};

export const transferCanceledMessageToApproverTemplate = () => {
	return `
    A transfer has been canceled from your mobile wallet. Please check your messages or app for the details. If you have any questions, please reach out to our support team at <support_email>.
    `;
};

export const transferApprovedMessageToIniatorTemplate = () => {
	return `
    Your request to receive money from wallet was approved.
    Please check your messages or app for the details. If you have any questions, please reach out to our support team at <support_email>.`;
};

export const transferApprovedMessageToApproverTemplate = () => {
	return `
    A transfer has been approved from your mobile wallet. Please check your messages or app for the details. If you have any questions, please reach out to our support team at <support_email>.
    `;
};

