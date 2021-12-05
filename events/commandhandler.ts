import { Message } from 'discord.js';
import { Command, ClientExtensionInterface } from '../types';
module.exports = {
  name: "commandhandler",
  eventName: "messageCreate",
  async execute(message:Message, client:ClientExtensionInterface) {
    if(message.member?.user.bot) return
    const prefix = await client.ClientFunction.getprefix(client, message.guild?.id) || client.PREFIX
    if (message.author.bot) return;
    if (message.content.indexOf(prefix) !== 0) return;

    let args:string[] | string = message.content.slice(prefix.length).trim().split(/ +/g);
    const commandName = args[0].toLowerCase();

    if(!client.MessageCommands.has(commandName)) return message.reply("I can't seem to find this command! Are you sure you typed it correctly?")
    args.shift();
    const command:Command = client.MessageCommands.get(commandName) as Command

    if(command.args == "single"){
      args = args.join(" ")
    }
    return command.execute(message, args, client) 
  }
}