import { Model, model, Schema } from "mongoose";
import { IOrder } from "../interfaces/IOrder";

const orderSchema = new Schema<IOrder>(
  {
    buyer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      address: { type: String },
      city: { type: String },
      zip: { type: String },
      phone: { type: String, required: true },
    },
    items: [
      {
        id: { type: String, required: true },
        title: { type: String, required: true },
        quantity: { type: Number, required: true },
        unit_price: { type: Number, required: true },
      },
    ],
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "in_process", "shipped"],
      default: "pending",
    },
    paymentId: { type: String },
    paymentMethod: { type: String, enum: ["card", "mp", "transfer"], required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const OrderModel: Model<IOrder> = model("order", orderSchema);

export default OrderModel;
