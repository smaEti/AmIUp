import chalk from "chalk";
import ps, { kill } from "ps-node";
export default function StopFunction(serviceName: string) {
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
          if (processNames[processNames.length - 1] == serviceName) {
            kill(process.pid);
            console.log(chalk.green(`${serviceName} ended`, process.pid));
          }
        }
      });
    }
  );
}
