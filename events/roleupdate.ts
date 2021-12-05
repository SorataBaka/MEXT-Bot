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
    var addvalid = true
    const mainrole = guildQuery[0].mainrole
    if(!newMember.guild?.roles.cache.has(mainrole)) return 
    for(const roleid of guildQuery[0].requiredRoles){
      if(!newMember.guild?.roles.cache.has(roleid)) return
      if(!newMember.roles.cache.has(roleid)) addvalid = false
    }
    if(addvalid) return newMember.roles.add(mainrole).catch()
    if(!addvalid) return newMember.roles.remove(mainrole).catch()
  } 
};