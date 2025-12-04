import { Request, Response } from 'express';
import { sendEmail } from '../services/emailService';

export const sendEmailController = async (req: Request, res: Response) => {
  try {
    const { to, subject, html, text } = req.body;

    if (!to || !subject || !html) {
      res.status(400).json({ success: false, error: 'Todos los campos son requeridos: to, subject, html' });
      return;
    }

    const data = await sendEmail({ to, subject, html, text });

    res.status(200).json({ success: true, data: { message: 'Email enviado correctamente', ...data } });
  } catch (error) {
    const e = error as Error
    console.error('Error al enviar el email:', e);
    res.status(500).json({ success: false, error: 'Error al enviar el email', details: e.message });
  }
};
