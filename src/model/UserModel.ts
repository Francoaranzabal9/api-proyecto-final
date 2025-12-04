import { Model, model, Schema } from "mongoose"
import IUser from "../interfaces/IUser"



const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, {
  versionKey: false,
  timestamps: true
})

const User: Model<IUser> = model("user", userSchema)


export default User