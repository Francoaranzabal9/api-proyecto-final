export const getEnv = () => {
  return {
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    URI_DB: process.env.URI_DB,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
  }
}