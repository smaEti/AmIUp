import { exit } from "process";
import ps from "ps-node";
import { spawn } from "child_process";
import fs from "node:fs";
export default function startFunction(){

const out = fs.openSync(__dirname + "/out.log", "a+");
const err = fs.openSync(__dirname + "/err.log", "a+");
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
            console.log(
              "process : ",
              process.pid,
              process.arguments,
              process.command
            );
            const processNames = process.arguments.map((item) =>
              item.split("/")
            )[0];
            if (processNames[processNames.length - 1] == "monitorProcess.js") {
              console.log(
                "monitorProcess is already running in the background.",
                process.pid
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
  const child = spawn("node", [__dirname + "/monitorProcess.js"], {
    detached: true,
    stdio: ["ignore", out, err],
  });
  child.unref();
});
}
