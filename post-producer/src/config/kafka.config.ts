import { Admin, Kafka, logLevel, Producer } from "kafkajs";

class KafkaConfig {
  private kafka: Kafka;
  private producer: Producer;
  private admin: Admin;
  private brokers: string;

  constructor() {
    this.brokers = process.env.KAFKA_BROKERS || "192.168.81.97:9092"
    this.kafka = new Kafka({
      clientId: 'post-producer', 
      brokers: [this.brokers], 
      logLevel: logLevel.ERROR
    }); 
    this.producer = this.kafka.producer();
    this.admin = this.kafka.admin();
  }


  async connect(): Promise<void> {
    try {
      await this.producer.connect();
      await this.admin.connect();
      console.log('kafka is connected')
    } catch (error) {
      console.error("Error connecting to kafka", error);
    }
  }

  async createTopic(topic: string): Promise<void> {
    try {
      await this.admin.createTopics({
        topics: [{ topic, numPartitions: 1}]
      });
      console.log('Topic created', topic);
    } catch(error) {
      console.error('Error creating topic', error);
    }
  }

  async sendToTopic(topic: string, message: string): Promise<void> {
    try {
      await this.producer.send({
        topic,  
        messages: [{ value: message }]
      }); 
      console.log("Message sent to topic", topic);
    } catch (error) {
      console.error("Error sending message", error);
    }
  }

  async clearTopic(topic: string):Promise<void> {
    try {
      await this.admin.deleteTopics({
        topics: [topic],
      });
      console.log("Topic deleted:", topic);
    } catch (error) {
      console.error("Error deleting topic", error)
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.producer.disconnect();
      await this.admin.disconnect();
      console.log("kafka disconnected");
    } catch (error) {
      console.error("Error disconnecting from kafka", error);
    }
  }
}

export default new KafkaConfig;
