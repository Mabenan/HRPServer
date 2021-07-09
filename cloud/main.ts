import { Process } from "../data/Process";
import { ReceipeProcessor } from "./ReceipeProcessor";

async function runProcess(name: string, cb: (process: Process) => Promise<void>): Promise<void>{
  const processQuery = new Parse.Query<Process>("Process");
  processQuery.equalTo("Name", name);
  const results = await processQuery.find({useMasterKey: true});
  var currentProc : Process;
  if (results.length <= 0) {
    currentProc = new Process();
    currentProc.Name = name;
  } else {
    currentProc = results[0];
  }

  if (!currentProc.Running) {
    currentProc.Running = true;
  }
  currentProc.init();
  currentProc.save(null,{useMasterKey: true}).catch((err) => console.log(err));
  cb(currentProc).then(() => {
    currentProc.Running = false;
    currentProc.save(null,{useMasterKey: true}).catch((err) => console.log(err));
  }).catch((err) => {
    console.log(err);
    currentProc.Running = false;
    currentProc.save(null,{useMasterKey: true}).catch((err) => console.log(err));
  });  
}

Parse.Cloud.job("ProcessReceipes", () => runProcess("ProcessReceipes", processReceipes));

function processReceipes(process: Process): Promise<void> {
  return new ReceipeProcessor().processReceipes(process);
}
