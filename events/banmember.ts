import { ClientExtensionInterface } from "../types"
import { GuildMember, MessageEmbed } from "discord.js"
module.exports = {
  name: "banmemberrole",
  eventName: "guildMemberUpdate",
  async execute(oldMember:GuildMember, newMember: GuildMember, client:ClientExtensionInterface){
    const guildQuery = await client.ClientDatabase.guildData.find({guildid: newMember.guild?.id})
    if(guildQuery.length == 0) return
    if(!guildQuery[0].bannedrole) return
    if(!guildQuery[0].mainrole) return

    const mainrole = guildQuery[0].mainrole
    const bannedrole = guildQuery[0].bannedrole
    if(newMember.roles.cache.has(bannedrole) && !newMember.roles.cache.has(mainrole)){
      const embed = new MessageEmbed()
        .setTitle(`You have been banned from ${newMember.guild?.name}!`)
        .setAuthor(`-${client.user?.tag}`)
        .setTimestamp()
        .setThumbnail(client.user?.avatarURL() as string)
        .setDescription("Un-registered or un-accepted member of the MEXT Scholarship Secondary Screening are not permitted in the server. If you think this is a mistake, please contact Sorata#3058")
        .setColor(await client.ClientFunction.generateColor())
      await newMember.send({
        embeds: [embed]
      }).catch(err => {
        console.log(err)
      })
      return newMember.ban({
        reason: "Not a member accepted into secondary screening by the Japanese Government"
      }).catch(err => {
        console.log(err)
      })
    }
  }
};