import mongoose, { Model } from "mongoose"
import redis from "redis"
import { ClientDatabaseInterface } from "../../types";
import { promisify } from "util"
import guildData from "../schema/requiredroles"
export default class DatabasesClass implements ClientDatabaseInterface {
  public guildData:Model<any> = guildData
  public RedisClient
  public getAsync
  public setAsync
  constructor(URI:string, redisIP:string, redisPORT:number){
    mongoose.connect(URI)
    mongoose.connection.on("connecting", () => {
      console.log("Connecting to MongoDB Database")
    })
    mongoose.connection.on("connected", () => {
      console.log("Connected to MongoDB Database")
    })
    mongoose.connection.on("error", (err) => {
      console.error(err)
      throw err
    })
    this.RedisClient = redis.createClient({
      host: redisIP,
      port: redisPORT,
      no_ready_check: true
    })
    this.RedisClient.on("connect", () => {
      console.log("Established stream to Redis Database server")
    })
    this.RedisClient.on("error", (err:any) => {
      console.error(err)
      throw err
    })
    this.RedisClient.on("end", () => {
      console.log("Connection to Redis Database Server has ended")
    })
    this.RedisClient.on("reconnecting", () => {
      console.log("Reconnecting to Redis Database Server")
    })
    this.getAsync = promisify(this.RedisClient.get).bind(this.RedisClient)
    this.setAsync = promisify(this.RedisClient.set).bind(this.RedisClient)
  }
}