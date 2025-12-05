import multer from "multer"
import path from "path"
import crypto from "crypto"

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    const name = Date.now() + "-" + crypto.randomUUID()
    let ext = path.extname(file.originalname)

    if (!ext) {
      if (file.mimetype === "image/jpeg") ext = ".jpg"
      else if (file.mimetype === "image/png") ext = ".png"
      else if (file.mimetype === "image/webp") ext = ".webp"
      else if (file.mimetype === "image/gif") ext = ".gif"
    }

    cb(null, name + ext)
  }
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