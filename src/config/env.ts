export const getEnv = () => {
  return {
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    URI_DB: process.env.URI_DB
  }
}