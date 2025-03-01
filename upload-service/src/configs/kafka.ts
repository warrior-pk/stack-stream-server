import { Kafka } from "kafkajs"
import logger from "@/utils/logger"

class KafkaConfig {
  private kafka: Kafka
  private producer: any
  private consumer: any
  constructor() {
    this.kafka = new Kafka({
      clientId: "upload-service",
      brokers: ["localhost:9092"],
    })
    this.producer = this.kafka.producer()
    this.consumer = this.kafka.consumer({ groupId: "video-processing-group" })
  }

  async produce(topic, messages) {
    try {
      const result = await this.producer.connect()
      logger.info("Kafka connected... : ", result)
      await this.producer.send({
        topic: topic,
        messages: messages
      })
    } catch (error) {
      logger.info(error)
    } finally {
      await this.producer.disconnect()
    }
  }

  async consume(topic, callback) {
    try {
      await this.consumer.connect()
      await this.consumer.subscribe({ topic: topic, fromBeginning: true })
      await this.consumer.run({
        eachMessage: async ({
          topic, partition, message
        }) => {
          const value = message.value.toString()
          callback(value)
        }
      })
    } catch (error) {
      logger.info(error)
    }
  }
}
export default KafkaConfig;
