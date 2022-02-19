import { Collection } from "discord.js"
import { ClientCollectionsInterface } from "../../types";

export default class ClientCollections implements ClientCollectionsInterface {
  public sentMessages: Collection<string, string[]>; 
  constructor(){
    this.sentMessages = new Collection<string, string[]>()
  }
}