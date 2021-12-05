import { Client, Intents, Collection } from "discord.js"
import { config } from "dotenv"

import { Command, Events, ClientExtensionInterface, ClientFunctionInterface, ClientCollectionsInterface, ClientDatabaseInterface } from "./types"
import ClientFunction from "./assets/classes/ClientFunctions"
import ClientCollection from "./assets/classes/ClientCollections"
import ClientDatabase from "./assets/classes/ClientDatabase"
import fs from "fs"
config()
console.clear()
if(!process.env.TOKEN || !process.env.PREFIX  || !process.env.URI) {
    console.error("Environmental variable for TOKEN, PREFIX, and URI is needed.")
    process.exit(1)
}

//Process all required ENV's
const TOKEN = process.env.TOKEN as string
const URI = process.env.URI as string
const REDIS_CONNECTION = process.env.REDIS_CONNECTION as string
const REDIS_IP = REDIS_CONNECTION.split(":")[0] as string
const REDIS_PORT = parseInt(REDIS_CONNECTION.split(":")[1]) as number

//Set bot intents
const intents:Intents = new Intents()
intents.add(Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES)

//Create new client
export default class ClientExtension extends Client implements ClientExtensionInterface{
  public MessageCommands:Collection<string, Command>
  public MessageCommandGroups:Collection<string, Collection<string, Command>>
  public EventCollection:Collection<string, Events>
  public ClientFunction:ClientFunctionInterface
  public ClientCollection:ClientCollectionsInterface
  public ClientDatabase:ClientDatabaseInterface
  public PREFIX = process.env.PREFIX as string
  public INVITE_LINK = process.env.INVITE_LINK as string || "No invite link provided"
  public constructor(intents:Intents) {
      super({ intents: intents })
      this.MessageCommands = new Collection()
      this.MessageCommandGroups = new Collection()
      this.EventCollection = new Collection()
      this.ClientFunction = new ClientFunction()
      this.ClientCollection = new ClientCollection()
      this.ClientDatabase = new ClientDatabase(URI, REDIS_IP, REDIS_PORT)
  }
}
const client:ClientExtension = new ClientExtension(intents)
//Read every command in every subfolder of commands directory
const commandFolderPath:string = __dirname + "/commands"
const eventFolderPath:string = __dirname + "/events"

const subCommandFolder:string[] = fs.readdirSync(commandFolderPath)
const subEventFolder:string[] = fs.readdirSync(eventFolderPath)

for(const subFolder of subCommandFolder){
  const commands:string[] = fs.readdirSync(`${commandFolderPath}/${subFolder}`)
  for(const commandFile of commands){
    const command:Command = require(`${commandFolderPath}/${subFolder}/${commandFile}`)
    if(client.MessageCommands.has(command.name)) throw "Duplicate Command Name detected. Aborting startup."
    client.MessageCommands.set(command.name, command)
    if(client.MessageCommandGroups.has(command.commandGroup)){
      client.MessageCommandGroups.get(command.commandGroup)?.set(command.name, command)
    } else {
      const newGroup:Collection<string, Command> = new Collection()
      newGroup.set(command.name, command)
      client.MessageCommandGroups.set(command.commandGroup, newGroup)
    }
  }
}
for(const eventFile of subEventFolder){
  const event:Events = require(`${eventFolderPath}/${eventFile}`)
  client.EventCollection.set(event.name, event)
  client.on(event.eventName, (...args:any) => event.execute(...args, client))
}

//Login the bot
client.login(TOKEN)
export { client }
process.on("SIGINT" || "SIGTERM", () => {
  console.log("Shutting down")
  client.destroy()
  process.exit(0)
})