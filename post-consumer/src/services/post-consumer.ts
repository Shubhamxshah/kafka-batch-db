import { MESSAGE_MATCHER_IS_ALREADY_BUILT } from "hono/router";
import kafkaConfig from "../config/kafka-config";
import PostModel from "../model/posts";

export const postConsumer = async () => {
  const messages: any[] = [];
  let processing = false;

  try {
    await kafkaConfig.subscribeTopic("post")
    
    await kafkaConfig.consume(async (message) => {
      messages.push(message);
      console.log("message received", message)
    
      if (messages.length > 100) {
        processMessages();
      }

    })

    setInterval(processMessages, 5000); //also run every 5 seconds
  } catch (err) {
    
  }

  async function processMessages() {
    if (messages.length > 0 && !processing) {
      processing = true;
      const batchToProcess = [...messages];
      messages.length = 0;

      try {
        await PostModel.insertMany(batchToProcess, {ordered: false }); 
        console.log("bulk insertion completed")
      } catch (error) {
        console.log("Error inserting messages:", error);
        messages.push(...batchToProcess);
      } finally {
        processing = false;
      }
    }
  }
}

