import { ConfigService, container } from "artos";
import * as childProcess from "child_process";
import { Request, RequestHandler, Response } from "express";
import * as fs from "fs";
import { InstancesDTO } from "../../shared/dto";

const configService: ConfigService = container.getService(ConfigService);

export class InstancesController {
  public index(): RequestHandler {
    return (request: Request, response: Response): void => {
      childProcess.exec(`find ${configService.get("INSTANCES_ROOT", "..")} -maxdepth ${configService.get("INSTANCES_DEPTH", "2")} -name "forever.json"`, (error: any, stdout: string) => {
        if (error) { response.sendStatus(500); return; }
        const list = stdout.split("\n");
        if (list.length === 0) { response.sendStatus(500); return; }

        response.json(list.filter((instance: string) => instance !== "").map((instance: string) => InstancesDTO.parse({
          project: JSON.parse(fs.readFileSync(instance, "utf8")).uid,
          path: instance,
        }).serialize()));
      });
    };
  }
}
