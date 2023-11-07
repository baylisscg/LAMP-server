import pino from "pino"

function makeLogger(): pino.Logger {
  const config = {
    app: "lamp",
    level: process.env.LOG_LEVEL || "info" // Default's to info if null
  }
  return pino(config)
}

export const logger = makeLogger()

