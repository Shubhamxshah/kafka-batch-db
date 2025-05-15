import { connectDb } from "./config/db-config"
import kafkaConfig from "./config/kafka-config"

export const init = async () => {
  try {
    await connectDb()
    await kafkaConfig.connect()
  } catch (err) {
    console.log('Error initializing services', err)
    process.exit(1)
  }
}
