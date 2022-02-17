import { Message, Role } from "discord.js"
import { ClientExtensionInterface } from "../../types"
import fs from "fs"
const prefectureArray:string[] = JSON.parse(fs.readFileSync(__dirname + "/../../assets/JSON/prefectures.json", "utf8"))

module.exports = {
  name: 'getprefect',
  description: "Gets a prefecture role",
  usage: 'getprefect {getprefect}',
  args: 'single',
  commandGroup: "rolemanager",
  commandGroupName: "getprefect",
  async execute(message:Message, args:string, client:ClientExtensionInterface){
    if(args.length === 0) return message.reply("Please provide a prefecture name!")
    const prefecture = prefectureArray.find(prefecture => prefecture.toLowerCase() === args.toLowerCase())
    if(!prefecture) return message.reply("Please provide a valid prefecture name!")
    const role = message.guild?.roles.cache.find(role => role.name === prefecture)
    if(!role) return message.reply("Seems like this prefecture role doesn't exist. If you think this is a mistake, please contact an admin!")
    
    for(const prefect of prefectureArray){
      if(message.member?.roles.cache.find(role => role.name.toLowerCase() === prefect.toLowerCase()) !== undefined){
        const oldrole = message.guild?.roles.cache.find(role => role.name.toLowerCase() === prefect.toLowerCase()) as Role
        if(!oldrole) return message.reply("There seems to be a mistake in the database. Please contact an admin.")
        await message.member?.roles.remove(oldrole).catch((err:Error) => {
          return message.reply("There seems to be a problem in removing the role. Please try again later.")
        })
        break
      }
    }
    await message.member?.roles.add(role).catch((err:Error) => {
      return message.reply("It seems like I can't give you this role! Please contact an admin!")
    })
    return message.reply("You have been given the role **" + prefecture + "**!")

  }
}

