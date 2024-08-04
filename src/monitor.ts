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
      startFunction();
      break;
    }
    case "stop": {
      StopFunction();
      break;
    }
    case "add": {
      try {
        await client.connect();
        const db = client.db("AmIUp");
        const WebSitesCollection = db.collection("WebSites");
        if (args[1] && args[2] && args[3]) {
          if (args[2] !== "tel" && args[2] !== "email" && args[2] != "sms") {
            console.log(chalk.bgRed("method should be : sms , tel or email"));
            exit(0);
          }
          args = args.map((arg) => arg.replace('"', ""));
          const inputData = {
            website_url: args[1],
            alert_method: args[2],
            method_data: args[3],
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
    default: {
      //statements;
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

//add
//db connection
//create a db record for model

//check
//run the process one time

//report
//gets datas from database and writes it in a file or prints it on screen
