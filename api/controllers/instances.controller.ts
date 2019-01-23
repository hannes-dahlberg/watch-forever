import * as childProcess from "child_process";
import { Request, RequestHandler, Response } from "express";
import { InstancesDTO } from "../../shared/dto";

export class InstancesController {
  public index(): RequestHandler {
    return (request: Request, response: Response): void => {
      childProcess.exec(`find .. -maxdepth 2 -name "forever.json"`, (error: any, stdout: string) => {
        if (error) { response.sendStatus(500); return; }
        const list = stdout.split("\n");
        if (list.length === 0) { response.sendStatus(500); return; }
        response.json(list.filter((instance: string) => instance !== "").map((instance: string) => InstancesDTO.parse({
          project: instance.split("/")[1],
          path: instance,
        }).serialize()));
      });
    };
  }
}
