import { Message, MessageEmbed } from "discord.js"
import { ClientExtensionInterface } from "../../types"
import fs from "fs"
const prefectureArray:string[] = JSON.parse(fs.readFileSync(__dirname + "/../../assets/JSON/prefectures.json", "utf8"))

module.exports = {
  name: 'listprefect',
  description: "lists every prefecture role",
  usage: 'listprefect',
  args: 'single',
  commandGroup: "rolemanager",
  commandGroupName: "listprefect",
  async execute(message:Message, args:string, client:ClientExtensionInterface){
    const embed = new MessageEmbed()
    embed.setTitle("List of prefectures")
    embed.setColor(await client.ClientFunction.generateColor())
    embed.setDescription("Here is a list of prefecture roles in the server! If your prefecture is not here, please contact an admin!")
    embed.setTimestamp()
    embed.setThumbnail(client.user?.avatarURL() as string)
    embed.setFooter(client.user?.username as string, client.user?.avatarURL() as string)
    var parsedPrefectRoles:string[] = []
    for(const prefect of prefectureArray){
      const newPrefect = "`" + prefect + "`"
      parsedPrefectRoles.push(newPrefect)
    }
    embed.addField("Prefectures", parsedPrefectRoles.join(", "))
    return message.channel.send({
      embeds: [embed]
    }).catch((err:Error) => {
      return message.reply("There seems to be a problem in sending the embed. Please try again later.")
    })
  }
}

