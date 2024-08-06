import axios from "axios";
import client from "./dbClient";
import chalk from "chalk";
import emailService from "./emailService";
import telegramService from "./telegramService";
const checkWebsites = async () => {
  const date = new Date().toISOString();
  await client.connect();
  const db = client.db("AmIUp");
  const WebSitesCollection = db.collection("WebSites");
  const methodCollection = db.collection("methods");
  const logCollection = db.collection("logs");
  const methods = await methodCollection.find().toArray();
  const data = await WebSitesCollection.find().toArray();

  const promises = data.map(async (site) => {
    try {
      const response = await axios({
        method: "get",
        url: site.website_url,
        timeout: 5000,
      });
      if (response.status != 200) throw new Error(`${site.website} is down.`);
      return { host: site.website_url, status: "UP" };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return { host: site.website_url, status: "DOWN" };
    }
  });

  const results = await Promise.all(promises);
  const failedWebSites: {
    host: string;
    status: string;
  }[] = [];
  console.log(chalk.yellow(date));
  const promises2 = results.map(async (result) => {
    console.log(
      result.status === "UP"
        ? chalk.underline.green("UP")
        : chalk.underline.red("DOWN"),
      "\t",
      chalk.underline.blueBright(result.host)
    );
    console.log("");
    await logCollection.insertOne({
      website_url: result.host,
      status: result.status,
      date: date,
    });
    console.log("inserting");
    if (result.status === "DOWN") failedWebSites.push(result);
  });
  await Promise.all(promises2);
  await client.close();
  if (failedWebSites.length !== 0) {
    if (methods) {
      methods.map((method) => {
        if (method.method === "email") {
          emailService(method.method_data, failedWebSites, date);
        } else if (method.method === "sms") {
          // sms logic
        }
      });
    }
    telegramService(failedWebSites, date);
  }
};

checkWebsites();

setInterval(checkWebsites, 1800000);
