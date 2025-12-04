import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config()

const USER = process.env.EMAIL_USER
const PASS = process.env.EMAIL_PASS

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: USER,
    pass: PASS
  }
})

transporter.verify().then(() => {
  console.log("✅ Nodemailer está listo para enviar correos");
}).catch((error) => {
  console.error("❌ Error configurando Nodemailer:", error);
});

export default transporter
