import { Expo, ExpoPushMessage } from "expo-server-sdk";

const expoClient = new Expo({
	useFcmV1: true,
});

const sendPushMessage = async (
	tokens: string[],
	message: string,
	title?: string,
	body?: string,
	priority?: "default" | "high" | "normal",
	badge?: number
) => {
	try {
		const pushMessages: ExpoPushMessage[] = tokens.map((token) => ({
			to: token,
			sound: "default",
			title: title ?? "",
			body: body ?? message,
			data: { message },
			priority: priority,
			badge: badge ?? 1,
		}));
		const notRegisteredPushTokens = [];
		const tickets = await expoClient.sendPushNotificationsAsync(
			pushMessages
		);
		for (let ticket of tickets) {
			if (
				ticket.status === "error" &&
				ticket.details?.error === "DeviceNotRegistered"
			) {
				notRegisteredPushTokens.push(
					(ticket.details as any).expoPushToken
				);
			}
		}
		console.log("send_single_message_to_multiple_users.tickets", tickets);
		return notRegisteredPushTokens;
	} catch (error) {
		console.error(error);
	}
};

export default sendPushMessage;
