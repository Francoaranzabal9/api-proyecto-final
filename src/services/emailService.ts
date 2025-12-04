import transporter from "../config/emailConfig"
import createTemplate from "../templates/emailTemplate"

interface SendEmailProps {
  to: string
  subject: string
  message: string
}

export const sendEmail = async ({ to, subject, message }: SendEmailProps) => {
  try {
    const info = await transporter.sendMail({
      from: `"Tienda de software" <${process.env.EMAIL_USER}>`,
      to: to,
      subject,
      html: createTemplate(subject, message),
    })

    return info
  } catch (error) {
    console.error("Error en servicio sendEmail:", error)
    throw error
  }
}