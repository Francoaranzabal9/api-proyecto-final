import { model, Schema } from "mongoose"
import IUser from "../interfaces/IUser"



const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" }
}, {
  versionKey: false,
  timestamps: true
})

const User = model<IUser>("user", userSchema)


export default User