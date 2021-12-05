import mongoose from "mongoose"
const guildSchema = new mongoose.Schema({
  guildid: {
    type: String,
    required: true
  },
  requiredRoles: [{
    type: String,
    required: true
  }],
  mainrole: {
    type: String,
    required: true
  }
})

export default mongoose.model("guild-data", guildSchema)