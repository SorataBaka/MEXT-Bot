import { Message } from 'discord.js';
import { ClientExtensionInterface } from "../../types"
module.exports = {
  name: "registerrole",
  description: "Registers a required role",
  usage: "registerrole {role id}",
  args: "multiple",
  commandGroup: "Utils",
  commandGroupName: "registerrole",
  async execute(message: Message, args: string[] | string, client: ClientExtensionInterface) {
    
  }
}