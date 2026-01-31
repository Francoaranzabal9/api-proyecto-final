import { connectDB } from "../config/mongodb";
import User from "../model/UserModel";
import mongoose from "mongoose";

const setAdmin = async () => {
  const email = process.argv[2];

  if (!email) {
    console.error("❌ Por favor, proporciona un email como argumento.");
    console.log("Ejemplo: npx ts-node src/scripts/setAdmin.ts usuario@ejemplo.com");
    process.exit(1);
  }

  try {
    // Conectar a la base de datos
    await connectDB();

    // Buscar y actualizar el usuario
    const user = await User.findOneAndUpdate(
      { email: email },
      { role: "admin" },
      { new: true }
    );

    if (!user) {
      console.error(`❌ Usuario no encontrado con el email: ${email}`);
    } else {
      console.log(`✅ ¡Éxito! El usuario ${user.email} ahora es ADMIN.`);
      console.log(user);
    }

  } catch (error) {
    console.error("Error actualizando el usuario:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

setAdmin();
