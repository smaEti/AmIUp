import { exit } from "process";
import ps from "ps-node";
import { spawn } from "child_process";
import fs from "node:fs";
import chalk from "chalk";
export default function startFunction(serviceName : string) {
  if (!fs.existsSync(__dirname + `/logs/${serviceName}`)) {
    fs.mkdirSync(__dirname + `/logs/${serviceName}`, { recursive: true });
  }
  const date = new Date();
  const out = fs.openSync(
    __dirname +
      `/logs/${serviceName}/${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-out.log`,
    "a+"
  );
  const err = fs.openSync(
    __dirname +
      `/logs/${serviceName}/${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-error.log`,
    "a+"
  );
  function checkRunning() {
    return new Promise<void>((resolve) => {
      ps.lookup(
        {
          command: "node",
        },
        function (err, resultList) {
          if (err) {
            throw new Error(err.message);
          }

          resultList.forEach(function (process) {
            if (process) {
              const processNames = process.arguments.map((item) =>
                item.split("/")
              )[0];
              if (
                processNames[processNames.length - 1] == serviceName
              ) {
                console.log(
                  chalk.yellow(
                    `${serviceName} is already running in the background.`,
                    process.pid
                  )
                );
                exit(0);
              }
            }
          });
          resolve();
        }
      );
    });
  }
  checkRunning().then(() => {
    const child = spawn("node", [__dirname + `/${serviceName}`], {
      detached: true,
      stdio: ["ignore", out, err],
    });
    child.unref();
    console.log(chalk.green(`${serviceName} started!`));
  });
}
