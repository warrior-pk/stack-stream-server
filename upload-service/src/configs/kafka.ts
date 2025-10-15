import { Kafka } from "kafkajs"
import logger from "@/utils/logger"

class KafkaConfig {
  private kafka: Kafka
  private producer: any
  private consumer: any
  
  constructor() {
    this.kafka = new Kafka({
      clientId: "upload-service",
      brokers: [process.env.KAFKA_BROKERS || "kafka:29092"], // Use env var
    })
    this.producer = this.kafka.producer()
    this.consumer = this.kafka.consumer({ groupId: "video-processing-group" })
  }

  async produce(topic: string, messages: any[]) {
    try {
      await this.producer.connect()
      logger.info("Kafka producer connected...")
      
      await this.producer.send({
        topic: topic,
        messages: messages
      })
      
      logger.info(`Message sent to topic: ${topic}`)
    } catch (error) {
      logger.error("Kafka produce error:", error)
      throw error // Re-throw for proper error handling
    } finally {
      await this.producer.disconnect()
    }
  }

  async consume(topic: string, callback: (value: string) => void) {
    try {
      await this.consumer.connect()
      await this.consumer.subscribe({ topic: topic, fromBeginning: true })
      
      logger.info(`Subscribed to topic: ${topic}`)
      
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          const value = message.value?.toString()
          if (value) {
            logger.info(`Received message from ${topic}:${partition}`)
            callback(value)
          }
        }
      })
    } catch (error) {
      logger.error("Kafka consume error:", error)
      throw error
    }
  }

  async disconnect() {
    try {
      await this.producer.disconnect()
      await this.consumer.disconnect()
      logger.info("Kafka disconnected")
    } catch (error) {
      logger.error("Kafka disconnect error:", error)
    }
  }
}

export default KafkaConfig;
