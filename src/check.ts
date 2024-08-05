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
      return { host: url.hostname, status: "UP" };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return { host: url.hostname, status: "DOWN" };
    }
  });

  const results = await Promise.all(promises);
  console.log("")
  results.forEach((result) => {
    console.log(
      result.status == "UP" ? chalk.underline.green("UP") : chalk.underline.red("DOWN"),
      "\t",
      chalk.underline.blueBright(result.host),
    );
  });
  console.log("")
}
