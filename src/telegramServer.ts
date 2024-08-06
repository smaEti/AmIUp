import TelegramBot from "node-telegram-bot-api";
import express, { Request, Response } from "express";
import { HttpsProxyAgent } from "https-proxy-agent";
import cors from "cors";
import client from "./dbClient";
import "dotenv/config";
const token = process.env.TELEGRAM_API;
const proxyUrl = process.env.WEB_PROXY;
const expressPort = process.env.TELEGRAM_SERVER_PORT;
const app = express();
app.use(cors());
app.use(express.json());

const agent = new HttpsProxyAgent(proxyUrl!);
const bot = new TelegramBot(token!, {
  polling: true,
  request: { url: "fuck", agent: agent },
});
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "Welcome! use /enable to add your id to app's DB."
  );
});
bot.onText(/\/enable/, async (msg) => {
  await client.connect();
  const db = client.db("AmIUp");
  const telcollection = db.collection("telegramUsers");
  await telcollection.insertOne({ chat_id: msg.chat.id });
  await client.close();
  bot.sendMessage(msg.chat.id, "your id added to DB.");
});
bot.onText(/\/disable/, async (msg) => {
  await client.connect();
  const db = client.db("AmIUp");
  const telcollection = db.collection("telegramUsers");
  await telcollection.deleteOne({ chat_id: msg.chat.id });
  await client.close();
  bot.sendMessage(msg.chat.id, "bot disabled.");
});

app.post("/send-alert", async (req: Request, res: Response) => {
  try {
    const sites = req.body.sites;
    const date = req.body.date;
    console.log("down sites:",sites);
    const string = sites.map(
      (site: { host: string; status: string }) => site.host + "\n"
    );
    await client.connect();
    const db = client.db("AmIUp");
    const telcollection = db.collection("telegramUsers");
    const users = await telcollection.find().toArray();
    await client.close();
    for (const user of users) {
      bot.sendMessage(
        user.chat_id,
        `this websites were down in ${date} \n` + string
      );
    }
    res.status(200).send("alert has been sent to telegram users.");
  } catch (e) {
    res.status(500).send(e);
  }
});
app.get("/", (req: Request, res: Response) => {
  res.status(200).send("api is running");
});
app.listen(expressPort, () => {
  console.log(`telegram server listening on port ${expressPort}`);
});
