import { Model, model, Schema } from "mongoose";
import { Perfume } from "../interfaces/IPerfume";

const perfumeSchema = new Schema<Perfume>({
  name: { type: String, required: [true, 'El nombre del perfume es obligatorio.'], unique: true, trim: true },
  brand: { type: String, required: [true, 'La marca del perfume es obligatoria.'], trim: true },
  concentration: { type: String, enum: ['EDP', 'EDT', 'Parfum', 'EDC', 'Extrait'], required: [true, 'La concentración es obligatoria.'] },
  genre: { type: String, enum: ['Masculino', 'Femenino', 'Unisex'], required: [true, 'El género es obligatorio.'] },
  volumeMl: { type: Number, required: [true, 'El volumen es obligatorio.'] },
  description: { type: String, required: [true, 'La descripción corta es obligatoria.'] },
  price: { type: Number, required: [true, 'El precio es obligatorio.'] },
  stock: { type: Boolean, default: true },
  image: { type: String }
}, {
  timestamps: true,
  versionKey: false
})

const PerfumeModel: Model<Perfume> = model("perfume", perfumeSchema)

export default PerfumeModel