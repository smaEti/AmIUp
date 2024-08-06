import { argv, exit } from "process";
import startFunction from "./start";
import StopFunction from "./stop";
import chalk from "chalk";
import client from "./dbClient";
import "dotenv/config";
import check from "./check";
import report from "./report";

async function handleArg(args: string[]) {
  // console.log(args);
  switch (args[0]) {
    case "start": {
      startFunction("telegramServer.js");
      startFunction("monitorProcess.js");
      break;
    }
    case "stop": {
      StopFunction("telegramServer.js");
      StopFunction("monitorProcess.js");
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
      if (!args[1]) {
        console.log(chalk.bgRed("expected 2 arguments"));
        exit(0);
      }
      report(args[1]);
      break;
    }
    case "check": {
      check();
      break;
    }
    case "addAlertMethod": {
      if (args[1] !== "email" && args[1] != "sms" && !args[2]) {
        console.log(chalk.bgRed("expected 3 argument"));
        console.log(chalk.bgRed("method should be : sms or email"));
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
      console.log(chalk.white.underline.bold("| AmIUp Help\n"));
      console.log(chalk.rgb(107, 3, 252)("Commands:\n"));
      console.log(chalk.cyan(" |DataBase Commands:"));
      console.log(
        chalk.rgb(252, 3, 107)("   add [website]"),
        chalk.dim("\t add the website you want to be monitored.")
      );
      console.log(
        chalk.rgb(252, 3, 107)("   remove [website]"),
        chalk.dim("\t remove the website from being monitored.")
      );
      console.log(
        chalk.rgb(252, 3, 107)("   addAlertMethod [method] [method_data]\t \n"),
        chalk.dim(
          "        add a method for sending alerts and add the data related to it.\n         for example addAlertMethod email email@email.com"
        )
      );
      console.log(chalk.cyan(" |Service Commands:"));
      console.log(
        chalk.rgb(255, 165, 0)("   start \t"),
        chalk.dim(" starts the monitoring system.")
      );
      console.log(
        chalk.rgb(255, 165, 0)("   stop \t"),
        chalk.dim(" stops the monitoring system.")
      );
      console.log(chalk.cyan(" |Monitor Commands:"));
      console.log(
        chalk.rgb(3, 252, 115)("   report [website]\t"),
        chalk.dim(" gives a monitor report file for the given website.")
      );
      console.log(
        chalk.rgb(3, 252, 115)("   check \t\t"),
        chalk.dim(" monitors the inserted websites and prints it to terminal.")
      );
      break;
    }
  }
}
handleArg(argv.slice(2));
