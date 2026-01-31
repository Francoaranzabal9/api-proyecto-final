import { Request, Response } from "express";
import { MercadoPagoConfig, Payment, Preference } from "mercadopago";
import OrderModel from "../model/OrderModel";
import { sendEmail } from "../services/emailService";
// import { IOrder } from "../interfaces/IOrder";


const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || ""
});

// Helper para enviar email
// Helper para enviar email
const sendOrderEmailHelper = async (order: any) => {
  try {
    const { buyer, items, total, _id, paymentMethod } = order;

    // Asegurarse de que items sea iterable (si viene de DB vs Request)
    const itemsList = items.map((item: any) => `- ${item.title} (x${item.quantity}): $${item.unit_price}`).join('<br>');

    const buyerMessage = `
      Hola ${buyer.name},<br><br>
      Gracias por realizar tu pedido en <strong>Sello Dorado</strong>.<br><br>
      <strong>Detalle del pedido:</strong><br>
      ${itemsList}<br><br>
      <strong>Total: $${total}</strong><br><br>
      <strong>ID de Orden:</strong> ${_id}<br><br>
      <strong>Datos de envío:</strong><br>
      Dirección: ${buyer.address || 'No especificada'}<br>
      Ciudad: ${buyer.city || 'No especificada'} (CP: ${buyer.zip || 'N/A'})<br>
      Teléfono: ${buyer.phone}<br><br>
      Nos pondremos en contacto contigo pronto para coordinar el envío o entrega.
    `;

    // Email al comprador
    await sendEmail({
      to: buyer.email,
      subject: "Confirmación de Pedido - Sello Dorado",
      message: buyerMessage,
    });

    // Email al administrador (tienda)
    const adminMessage = `
      <strong>Nuevo Pedido Recibido!</strong><br><br>
      <strong>Cliente:</strong> ${buyer.name} (${buyer.email})<br>
      <strong>Teléfono:</strong> ${buyer.phone}<br>
      <strong>Dirección:</strong> ${buyer.address}, ${buyer.city} (${buyer.zip})<br><br>
      <strong>Detalle del pedido:</strong><br>
      ${itemsList}<br><br>
      <strong>Total: $${total}</strong><br>
      <strong>ID de Orden:</strong> ${_id}<br>
      <strong>Método de Pago:</strong> ${paymentMethod}<br>
    `;

    await sendEmail({
      to: process.env.EMAIL_USER as string,
      subject: `NUEVO PEDIDO #${_id} - $${total}`,
      message: adminMessage,
    });

    console.log(`Emails de confirmación enviados (Cliente: ${buyer.email})`);
  } catch (error) {
    console.error("Error sending order email:", error);
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { buyer, items, total, paymentMethod } = req.body;

    const newOrder = new OrderModel({
      buyer,
      items,
      total,
      paymentMethod,
      status: "pending",
    });

    const savedOrder = await newOrder.save();

    // Enviar email SOLO si NO es Mercado Pago
    // Para MP, lo enviamos cuando el usuario vuelve a la página (/success)
    if (paymentMethod !== 'mp') {
      await sendOrderEmailHelper(savedOrder);
    }

    if (paymentMethod === "mp") {
      const preference = new Preference(client);

      const body = {
        items: items.map((item: any) => ({
          id: item.id,
          title: item.title,
          quantity: Number(item.quantity),
          unit_price: Number(item.unit_price),
          currency_id: "ARS",
        })),
        // En api-proyecto-final/src/controllers/paymentController.ts

        back_urls: {
          success: "https://el-sello-dorado.vercel.app/success",
          failure: "https://el-sello-dorado.vercel.app/failure",
          pending: "https://el-sello-dorado.vercel.app/pending",
        },
        auto_return: "approved",
        payer: {
          email: buyer.email,
        },
        external_reference: savedOrder._id.toString(),
        notification_url: "https://api-sello-dorado.onrender.com/payment/webhook",
      };

      console.log("Preference Body:", JSON.stringify(body, null, 2));

      const result = await preference.create({ body });

      return res.status(201).json({
        message: "Order created successfully",
        orderId: savedOrder._id,
        init_point: result.init_point,
        id: result.id, // ID de la preferencia para Wallet Brick
      });
    } else if (paymentMethod === "transfer") {
      return res.status(201).json({
        message: "Order created successfully. Waiting for transfer.",
        orderId: savedOrder._id,
      });
    } else if (paymentMethod === "card") {
      savedOrder.status = 'approved';
      await savedOrder.save();

      return res.status(201).json({
        message: "Card payment processed successfully (Mock)",
        orderId: savedOrder._id,
      });
    }

  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({ error: "Error al crear la orden" });
  }
};

export const sendConfirmationEmailManual = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await OrderModel.findById(id);

    if (!order) {
      return res.status(404).json({ error: "Orden no encontrada" });
    }

    // Enviamos el email usando el helper
    await sendOrderEmailHelper(order);

    return res.status(200).json({ message: "Email enviado correctamente" });
  } catch (error) {
    return res.status(500).json({ error: "Error enviando email" });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {

    const { status } = req.query;

    let filter = {};
    if (status) {
      filter = { status };
    }

    const orders = await OrderModel.find(filter).sort({ createdAt: -1 });

    return res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ error: "Error al obtener las órdenes" });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await OrderModel.findById(id);

    if (!order) {
      return res.status(404).json({ error: "Orden no encontrada" });
    }

    return res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    return res.status(500).json({ error: "Error al obtener la orden" });
  }
};

export const receiveWebhook = async (req: Request, res: Response) => {
  try {

    const paymentId = req.query.id || req.query['data.id'] || req.body.data?.id;
    const topic = req.query.topic || req.query.type || req.body.type;

    if (topic === 'payment' && paymentId) {

      const payment = new Payment(client);
      const paymentInfo = await payment.get({ id: Number(paymentId) });

      const orderId = paymentInfo.external_reference;

      if (orderId) {
        let newStatus: 'pending' | 'approved' | 'rejected' = 'pending';

        if (paymentInfo.status === 'approved') newStatus = 'approved';
        if (paymentInfo.status === 'rejected') newStatus = 'rejected';

        const updatedOrder = await OrderModel.findByIdAndUpdate(orderId, {
          status: newStatus,
          paymentId: paymentId.toString(),
          paymentMethod: 'mp'
        }, { new: true });

        console.log(`Orden ${orderId} actualizada a status: ${newStatus}`);

        if (updatedOrder && newStatus === 'approved') {
          const { buyer, items, total } = updatedOrder;
          const itemsList = items.map((item: any) => `- ${item.title} (x${item.quantity}): $${item.unit_price}`).join('<br>');

          const approvedMessage = `
            Hola ${buyer.name},<br><br>
            ¡Tu pago ha sido confirmado correctamente!<br><br>
            <strong>Hemos recibido tu pedido #${updatedOrder._id}</strong>.<br><br>
            <strong>Detalle:</strong><br>
            ${itemsList}<br><br>
            <strong>Total: $${total}</strong><br><br>
            Estamos preparando tu paquete para enviarlo a:<br>
            ${buyer.address}, ${buyer.city}<br><br>
            Te avisaremos cuando salga a despacho.
          `;

          await sendEmail({
            to: buyer.email,
            subject: "Pago Confirmado - Sello Dorado",
            message: approvedMessage,
          });
          console.log(`Email de pago aprobado enviado a ${buyer.email}`);
        }
      }
    }

    res.status(200).send("OK");
  } catch (error) {
    console.error("Webhook Error:", error);
    res.status(200).send("OK");
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "El estado es requerido" });
    }

    const updatedOrder = await OrderModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Orden no encontrada" });
    }

    // Si el estado cambia a 'approved', enviar email de confirmación
    if (status === 'approved') {
      try {
        const { buyer, items, total } = updatedOrder;
        const itemsList = items.map((item: any) => `- ${item.title} (x${item.quantity}): $${item.unit_price}`).join('<br>');

        const approvedMessage = `
          Hola ${buyer.name},<br><br>
          ¡Tu pedido ha sido aprobado!<br><br>
          <strong>Tu pedido #${updatedOrder._id} ha sido confirmado.</strong><br><br>
          <strong>Detalle:</strong><br>
          ${itemsList}<br><br>
          <strong>Total: $${total}</strong><br><br>
          Estamos preparando tu paquete para enviarlo a:<br>
          ${buyer.address}, ${buyer.city}<br><br>
          Te avisaremos cuando salga a despacho.
        `;

        await sendEmail({
          to: buyer.email,
          subject: "Pedido Aprobado - Sello Dorado",
          message: approvedMessage,
        });
        console.log(`Email de pedido aprobado enviado manualmente a ${buyer.email}`);
      } catch (emailError) {
        console.error("Error al enviar email de aprobación en updateOrder:", emailError);
      }
    } else if (status === 'shipped') {
      // Si el estado cambia a 'shipped', enviar email de aviso de envío
      try {
        const { buyer, items } = updatedOrder;
        const itemsList = items.map((item: any) => `- ${item.title} (x${item.quantity})`).join('<br>');

        const shippedMessage = `
          Hola ${buyer.name},<br><br>
          ¡Buenas noticias! Tu pedido va en camino.<br><br>
          <strong>Tu pedido #${updatedOrder._id} ha sido despachado.</strong><br><br>
          Pronto lo recibirás en la dirección: <strong>${buyer.address}, ${buyer.city}</strong>.<br><br>
          <strong>Productos en camino:</strong><br>
          ${itemsList}<br><br>
          Gracias por confiar en Sello Dorado.
        `;

        await sendEmail({
          to: buyer.email,
          subject: "¡Tu pedido ha sido enviado! - Sello Dorado",
          message: shippedMessage,
        });
        console.log(`Email de pedido enviado a ${buyer.email}`);
      } catch (emailError) {
        console.error("Error al enviar email de envío en updateOrder:", emailError);
      }
    }

    return res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    return res.status(500).json({ error: "Error al actualizar la orden" });
  }
};
