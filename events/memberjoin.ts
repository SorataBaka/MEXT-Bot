import { ClientExtensionInterface } from "../types"
import { GuildMember, MessageEmbed } from "discord.js"
module.exports = {
  name: "memberjoin",
  eventName: "guildMemberAdd",
  async execute(member:GuildMember, client:ClientExtensionInterface){
    const embed = new MessageEmbed()
      .setTitle(`Welcome to ${member.guild?.name}!`)
      .setAuthor(`-${client.user?.tag}`)
      .setTimestamp()
      .setThumbnail(client.user?.avatarURL() as string)
      .setDescription("Please make sure you select your roles in #roles in order to gain access to the server.")
      .setColor(await client.ClientFunction.generateColor())
    return member.send({
      embeds: [embed]
    }).catch(err => {
      console.log(err)
    })
  }
};