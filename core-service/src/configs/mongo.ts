import mongoose from "mongoose";
import { logger } from "@/utils";

const MONGO_URI = Bun.env.MONGO_URI || "mongodb://root:password@mongodb:27017/stack-sphere?authSource=admin";
const MAX_RETRIES = 50;
const RETRY_DELAY_MS = 3000;

let connectionInstance: typeof mongoose | null = null;

export async function connectToDatabase() {
  let attempts = 0;
  while (attempts < MAX_RETRIES) {
    try {
      connectionInstance = await mongoose.connect(MONGO_URI, {
        minPoolSize: 5,
        maxPoolSize: 100,
        serverSelectionTimeoutMS: 5000,
      });
      logger.info(`Connected to MongoDB successfully! DB HOST: ${connectionInstance.connection.host}`);
      break;
    } catch (error) {
      attempts++;
      logger.error(`MongoDB connection failed: ${error}`);
      logger.info(`Retrying (${attempts}/${MAX_RETRIES})...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    }
  }
  if (attempts === MAX_RETRIES) {
    logger.error(`Failed to connect to MongoDB after ${MAX_RETRIES} attempts.`);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  if (connectionInstance) {
    try {
      await mongoose.connection.close();
      logger.info("MongoDB connection closed.");
    } catch (error) {
      logger.error(`Error closing MongoDB connection: ${error}`);
    }
  }
  process.exit(0);
});