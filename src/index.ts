import dotenv from "dotenv"

dotenv.config({ debug: true })

import { logger } from "./utils/logger"

import https from "https"
import { HTTPS_CERT } from "./utils"
import { Bootstrap } from "./repository/Bootstrap"
import app from "./app"

// NodeJS v15+ do not log unhandled promise rejections anymore.
process.on("unhandledRejection", error => {
  console.dir(error)
})

// Initialize and configure the application.
async function main(): Promise<void> {
  logger.info("Initializing LAMP API server...")
  await Bootstrap()
  logger.info("Server routing initialized.")
  logger.info("Initialization complete.")

  // Begin listener on port 3000.
  const _server = process.env.HTTPS === "off" ? app : https.createServer(HTTPS_CERT, app)
  _server.listen(process.env.PORT || 3000)
}

main().then(() => {
  logger.info("Startup complete")
}).catch(console.error)
