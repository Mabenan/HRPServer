import { HRPTask } from "../data/Task";
import { ReceipeProcessor } from "./ReceipeProcessor";
import * as ServerManager from "server-manager-api";

Parse.Cloud.job("ProcessReceipes", (request: Parse.Cloud.JobRequest) => ServerManager.Cloud.runProcess("ProcessReceipes", processReceipes, request));
Parse.Cloud.job("SolveTask", (request: Parse.Cloud.JobRequest<SolveTaskRequest>) => ServerManager.Cloud.runProcess<SolveTaskRequest>("SolveTask", solveTask, request));

function processReceipes(process: ServerManager.Process): Promise<void> {
  return new ReceipeProcessor().processReceipes(process);
}

Parse.Cloud.define("SolveTask", (request: Parse.Cloud.FunctionRequest<SolveTaskRequest>) => Parse.Cloud.run("SolveTask", { Task: request.params.Task }), {
  requireUser: true,
  fields: {
    Task: {
      type: "String"
    }
  }
})

interface SolveTaskRequest extends Parse.Cloud.Params {
  Task: String;
}

async function solveTask(process: ServerManager.Process, request: Parse.Cloud.FunctionRequest<SolveTaskRequest>) {
  var task = await (new Parse.Query<HRPTask>("Task").equalTo("objectId", request.params.Task)).first({ useMasterKey: true });
  var dueDate = task.DueDate;
  dueDate.setHours(13, 0, 0, 0);
  var today = new Date();
  today.setHours(13, 0, 0, 0);
  const diffTime = Math.abs(dueDate.getTime() - today.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays > 0
    && task.Frequenz == 1) {
    console.log("You can not solve a daily before due");
  } else {
    task.LastSolved = today;
    var date = new Date(today.valueOf());
    date.setDate(date.getDate() + task.Frequenz);
    task.DueDate = date;
    await task.save(null, { useMasterKey: true });
    request.user.increment("Points", task.Points);
    request.user.save(null, { useMasterKey: true });
  }
}
