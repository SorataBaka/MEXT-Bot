import { Message } from 'discord.js';
import { ClientExtensionInterface } from "../../types"
module.exports = {
  name: "registermain",
  description: "Registers a main role",
  usage: "registermain {role id}",
  args: "multiple",
  commandGroup: "Utils",
  commandGroupName: "registermain",
  async execute(message: Message, args: string[] | string, client: ClientExtensionInterface) {
    if(!message.member?.permissions.has("MANAGE_GUILD")) return message.reply("You do not have any permission to use this command!")
    if(args.length == 0 ) return message.reply("Please provide a role ID!")
    const roleid = args[0] as string
    if(!message.guild?.roles.cache.has(roleid)) return message.reply("I can't find this role in this server. Are you sure you typed it correctly?")
    const rolename = message.guild?.roles.cache.get(roleid)?.name
    await client.ClientDatabase.guildData.findOneAndUpdate({
      guildid: message.guild?.id
    },{
      guildid: message.guild?.id,
      $set: {
        mainrole: roleid
      }
    }, {
      upsert: true
    }).then((data:any) => {
      if(data) return message.reply(`I have registered the role ${rolename} into the main roles list.`)
    }).catch((err:any) => {
      return message.reply("There seems to be a problem registering this role. Please try again.")
    })
    
  }
}