import { resend } from '../config/emailConfig';

interface SendEmailProps {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

export const sendEmail = async ({ to, subject, html, text }: SendEmailProps) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev', // Cambia esto por tu dominio verificado en producción
      to,
      subject,
      html,
      text
    });

    if (error) {
      console.error('Error sending email:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Error in sendEmail service:', error);
    throw error;
  }
};
