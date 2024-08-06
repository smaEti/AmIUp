import chalk from "chalk";
import client from "./dbClient";
import fs from "node:fs";
export default async function report(siteUrl: string) {
  const date = new Date().toISOString();
  if (!fs.existsSync(__dirname + `/reports`)) {
    fs.mkdirSync(__dirname + `/reports`, { recursive: true });
  }
  await client.connect();
  const db = client.db("AmIUp");
  const logCollection = db.collection("logs");
  const WebSitesCollection = db.collection("WebSites");
  const sites = await WebSitesCollection.find().toArray();
  let dataExist = false;
  const promises = sites.map(async (site) => {
    const dbSiteUrl: string = site.website_url;
    if (dbSiteUrl.includes(siteUrl)) {
      dataExist = true;
      const data = await logCollection
        .find({ website_url: dbSiteUrl })
        .toArray();
      let content: string = "";
      data.map((eachSite) => {
        content += `${eachSite.status}\t ${eachSite.date}\t ${eachSite.website_url}\n`;
      });
      fs.appendFile(
        __dirname + `/reports/${date}.txt`,
        content,
        { flag: "a+" },
        (err) => {
          if (err)
            console.log(chalk.bgRed("error in writing report in file", err));
          else
            console.log(
              chalk.green(
                `your report is ready in ${__dirname}/reports/${date} file`
              )
            );
        }
      );
    }
  });
  await Promise.all(promises);
  if (!dataExist)
    console.log(
      chalk.bgRed("did not find any websites that include your argument.")
    );
  await client.close();
}
