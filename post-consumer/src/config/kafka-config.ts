import { Admin, Kafka, logLevel, Consumer } from "kafkajs";

class KafkaConfig {
  private kafka: Kafka;
  private consumer: Consumer;
  private brokers: string;

  constructor() {
    this.brokers = process.env.KAFKA_BROKERS || "192.168.81.97:9092"
    this.kafka = new Kafka({
      clientId: 'post-producer', 
      brokers: [this.brokers], 
      logLevel: logLevel.ERROR
    }); 
    this.consumer = this.kafka.consumer({
      groupId: "post-consumer",
    });
  }


  async connect(): Promise<void> {
    try {
      await this.consumer.connect();
      console.log('kafka is connected')
    } catch (error) {
      console.error("Error connecting to kafka", error);
    }
  }

  async subscribeTopic(topic: string): Promise<void> {
    try {
      await this.consumer.subscribe({
        topic, 
        fromBeginning: true,
      });
      console.log("Subscribed to topic:", topic);
    } catch (err) {
      console.error("Error subscribing to topic: ", err)
    }
  }

  async consume(callback: (message: any) => void): Promise<void> {
    try {
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          console.log("Message received", {
            topic, 
            partition, 
            value: message?.value?.toString(),
          });
          callback(JSON.parse(message?.value?.toString()!));
        }
      })
    } catch (err) {
      console.log(err)
    } 
  } 

  async disconnect(): Promise<void> {
    try {
      await this.consumer.disconnect();
      console.log("kafka disconnected");
    } catch (error) {
      console.error("Error disconnecting from kafka", error);
    }
  }

}

export default new KafkaConfig;

