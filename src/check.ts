import axios from "axios";
import client from "./dbClient";
import chalk from "chalk";
import { URL } from "url";

export default async function check() {
  await client.connect();
  const db = client.db("AmIUp");
  const WebSitesCollection = db.collection("WebSites");
  const data = await WebSitesCollection.find().toArray();
  await client.close();

  const promises = data.map(async (site) => {
    const url = new URL(site.website_url);
    try {
      await axios({
        method: "get",
        url: site.website_url,
        timeout: 3000,
      });
      return { host: url.hostname, status: "up" };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return { host: url.hostname, status: "down" };
    }
  });

  const results = await Promise.all(promises);

  results.forEach((result) => {
    console.log(
      result.status == "up" ? chalk.bgGreen("up") : chalk.bgRed("down"),
      "\t",
      chalk.underline.blueBright(result.host)
    );
  });
}
