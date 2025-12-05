import multer from "multer"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import cloudinary from "../config/cloudinary"

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    allowed_formats: ["jpg", "png", "jpeg", "gif", "webp"],
    public_id: (req: any, file: any) => {
      const name = file.originalname.split(".")[0]
      return `${name}-${Date.now()}`
    }
  } as any
})

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true)
  } else {
    cb(new Error("Solo se permiten archivos de imagen"))
  }
}

const upload = multer({ storage, fileFilter })

export { upload }