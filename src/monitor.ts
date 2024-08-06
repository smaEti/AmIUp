import { argv, exit } from "process";
import startFunction from "./start";
import StopFunction from "./stop";
import chalk from "chalk";
import client from "./dbClient";
import "dotenv/config";
import check from "./check";

async function handleArg(args: string[]) {
  // console.log(args);
  switch (args[0]) {
    case "start": {
      if (args[1] == "telegram") startFunction("telegramServer.js");
      else startFunction("monitorProcess.js");
      break;
    }
    case "stop": {
      if (args[1] == "telegram") StopFunction("telegramServer.js");
      else if (args[1]) {
        console.log(`Invalid service : ${args[1]}`);
        exit(0);
      } else StopFunction("monitorProcess.js");
      break;
    }
    case "add": {
      try {
        await client.connect();
        const db = client.db("AmIUp");
        const WebSitesCollection = db.collection("WebSites");
        if (args[1]) {
          args = args.map((arg) => arg.replace('"', ""));
          const inputData = {
            website_url: args[1],
          };
          const data = await WebSitesCollection.findOne({
            website_url: args[1],
          });
          if (data) {
            await WebSitesCollection.updateOne(
              { website_url: args[1] },
              { $set: { inputData } },
              { upsert: false }
            );
            console.log(chalk.bgGreen(`data for website ${args[1]} updated!`));
            client.close();
          } else {
            await WebSitesCollection.insertOne(inputData);
            console.log(chalk.bgGreen(`${args[1]} added for monitoring!`));
            client.close();
          }
        } else {
          console.log(chalk.bgRed("expected 4 arguments"));
          client.close();
        }
      } catch (err) {
        console.log(chalk.bgRed(err));
      }
      break;
    }
    case "remove": {
      try {
        await client.connect();
        const db = client.db("AmIUp");
        const WebSitesCollection = db.collection("WebSites");
        if (args[1]) {
          args = args.map((arg) => arg.replace('"', ""));
          const data = await WebSitesCollection.findOne({
            website_url: args[1],
          });
          if (data) {
            await WebSitesCollection.deleteOne({ website_url: args[1] });
            console.log(chalk.green(`${args[1]} is deleted from the list!`));
            client.close();
          } else {
            console.log(chalk.yellow(`${args[1]} is not in the list!`));
            client.close();
          }
        } else {
          console.log(chalk.bgRed("expected 2 arguments"));
          client.close();
        }
      } catch (err) {
        console.log(chalk.bgRed(err));
      }
      break;
    }
    case "report": {
      //statements;
      break;
    }
    case "check": {
      check();
      break;
    }
    case "addAlertMethod": {
      if (args[1] !== "tel" && args[1] !== "email" && args[1] != "sms") {
        console.log(chalk.bgRed("method should be : sms , tel or email"));
        if (!args[2]) console.log(chalk.bgRed("expected 3 argument"));
        exit(0);
      }
      try {
        await client.connect();
        const db = client.db("AmIUp");
        const methodCollection = db.collection("methods");
        const data = await methodCollection.findOne({
          method_data: args[2],
        });

        if (data) {
          console.log(chalk.yellow(`${args[2]} is already in the list!`));
          client.close();
        } else {
          await methodCollection.insertOne({
            method_data: args[2],
            method: args[1],
          });
          console.log(chalk.bgGreen(`${args[1]} added for monitoring!`));
          client.close();
        }
      } catch (err) {
        console.log(chalk.bgRed(err));
      }
      break;
    }
    default: {
      break;
    }
  }
}
handleArg(argv.slice(2));
// ps.lookup(
//   {
//     command: "node",
//   },
//   function (err, resultList) {
//     if (err) {
//       throw new Error(err.message);
//     }

//     resultList.forEach(function (process) {
//       if (process) {
//         console.log(
//           "App is already running in the background.",
//           process.arguments,
//           process.pid
//         );
//       }
//     });
//   }
// );

//report
//gets datas from database and writes it in a file or prints it on screen
