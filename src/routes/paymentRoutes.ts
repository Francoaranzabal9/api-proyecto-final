
import { Router } from "express";
import { createOrder, receiveWebhook, getOrders, updateOrder, getOrderById, sendConfirmationEmailManual } from "../controllers/paymentController";

const paymentRouter = Router();

paymentRouter.post("/create-order", createOrder);
paymentRouter.post("/webhook", receiveWebhook);
paymentRouter.post("/confirm-email/:id", sendConfirmationEmailManual);

paymentRouter.get("/orders", getOrders);
paymentRouter.get("/orders/:id", getOrderById);
paymentRouter.patch("/orders/:id", updateOrder);

export default paymentRouter;