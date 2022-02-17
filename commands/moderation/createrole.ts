import { Message } from "discord.js"
import { ClientExtensionInterface } from "../../types"
module.exports = {
  name: 'createrole',
  description: "Creates a role for the server",
  usage: 'createrole {role name}',
  args: 'single',
  commandGroup: "moderation",
  commandGroupName: "slowmode",
  async execute(message:Message, args:string, client:ClientExtensionInterface){
    if(!message.member?.permissions.has("MANAGE_GUILD")) return message.reply("You don't have the permission to use this command!")
    if(args.length == 0) return message.reply("Please provide a role name!")
    const role = await message.guild?.roles.create({
      name: args,
      color: 'RANDOM',
      permissions: [],
      position: 2
    }).catch((err:Error) => {
      return undefined
    })
    if(!role) return message.reply("There seems to be a problem in creating the role. Please try again later.")
    const rolename = role.name
    return message.channel.send("I have created the role **" + rolename + "**")
  }
}

