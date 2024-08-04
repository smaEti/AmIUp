import ps, { kill } from "ps-node";
export default function StopFunction(){

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
            kill(process.pid);
            console.log(
                "monitorProcess ended",
                process.pid
            );
        }
    }
});
    }
  );
}
