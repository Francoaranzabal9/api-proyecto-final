import { Request, Response } from 'express';
import { sendEmail } from '../services/emailService';

export const sendEmailController = async (req: Request, res: Response) => {
  try {
    const { email, subject, message } = req.body;

    const data = await sendEmail({ to: email, subject, message });

    res.status(200).json({ success: true, data: { message: 'Email enviado correctamente', info: data } });
  } catch (error) {
    const e = error as Error
    console.error('Error al enviar el email:', e);
    res.status(500).json({ success: false, error: 'Error al enviar el email', details: e.message });
  }
};
