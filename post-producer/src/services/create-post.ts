import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import kafkaConfig from "../config/kafka.config";
import { z } from "zod";

const app = new Hono();

app.post(
  "/create-post",
  zValidator(
    "json",
    z.object({
      title: z.string(),
      content: z.string(),
    }),
  ),
  async (c) => {
    const { title, content } = c.req.valid("json");
    try {
      await kafkaConfig.sendToTopic("post", JSON.stringify({ title, content }));
      return c.json({ message: "Post created" });
    } catch (error) {
      console.error("error sending to topic from producer", error);
      return c.json({ error: "error sending message" }, 500);
    }
  },
);

export default app;
