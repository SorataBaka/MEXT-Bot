import { GuildMember } from "discord.js"
import { ClientExtensionInterface } from "../types";
module.exports = {
  name: "requiredrole",
  eventName: "guildMemberUpdate",
  async execute(oldMember:GuildMember, newMember:GuildMember, client:ClientExtensionInterface){
    const guildQuery = await client.ClientDatabase.guildData.find({guildid: oldMember.guild?.id})
    if(guildQuery.length == 0)return
    if(!guildQuery[0].requiredRoles)return
    if(!guildQuery[0].mainrole)return
    if(guildQuery[0].requiredRoles.length == 0)return
    const mainrole = guildQuery[0].mainrole
    if(!newMember.guild?.roles.cache.has(mainrole)) return 

    var amountOfRoleRequired = guildQuery[0].requiredRoles.length
    var rolehad = 0

    for(const roleidlist of guildQuery[0].requiredRoles){
      var flag = false
      for(const roleid of roleidlist){
        if(newMember.roles.cache.has(roleid)){
          flag = true
        }
      }
      if(flag) rolehad++
    }
    if(rolehad == amountOfRoleRequired){
      return newMember.roles.add(mainrole).catch(err => {
        console.log(err)
      })
    }else{
      return newMember.roles.remove(mainrole).catch(err => {
        console.log(err)
      })
    }
  } 
};