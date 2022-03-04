import { Message } from "discord.js";
import { ClientExtensionInterface } from "../types";
module.exports = {
	name: "ratelimiter",
	eventName: "messageCreate",
	async execute(message: Message, client: ClientExtensionInterface) {
		if (message.member?.user.bot) return;
		const messageContent = message.content;
		const messageAuthor = message.author.id;
		const messageChannel = message.channel;
		if (client.ClientCollections.sentMessages.has(messageAuthor)) {
			const messages = client.ClientCollections.sentMessages.get(messageAuthor);
			if (messages?.indexOf(messageContent) != -1) {
				await message.delete().catch();
				const replyMessage = await messageChannel
					.send(
						`<@${messageAuthor}> You're are being rate limited. You can only send the same message once every 5 messages`
					)
					.catch();
				return setTimeout(async () => {
					await replyMessage.delete().catch();
				}, 3000);
			}
			messages.push(messageContent);
			if (messages.length > 2) {
				messages.shift();
			}
			return;
		} else {
			return client.ClientCollections.sentMessages.set(messageAuthor, [
				messageContent,
			]);
		}
	},
};
