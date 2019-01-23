import * as childProcess from "child_process";
import { Request, RequestHandler, Response } from "express";
const forever: any = require("forever"); // tslint:disable-line:no-var-requires
import { ForeverDTO } from "../../shared/dto";

export class ForeverController {
  public index(): RequestHandler {
    return (request: Request, response: Response): void => {
      forever.list("", (error: any, data: any[]) => {
        if (error) { response.sendStatus(500); return; }

        if (!data) { response.json([]); return; }

        response.json(data.map((forever: any) => ForeverDTO.parse({
          uid: forever.uid,
          command: forever.command,
          fid: forever.foreverPid,
          pid: forever.pid,
          script: `${forever.cwd}/${forever.file}`,
          startTime: forever.ctime,
        }).serialize()));
      });
    };
  }
  public start(): RequestHandler {
    return (request: Request, response: Response): void => {
      if (request.body.command === undefined || request.body.uid === undefined) {
        response.sendStatus(500);
        return;
      }
      childProcess.exec(`forever start ${request.body.command}`, (error: any) => {
        if (error) { console.log(error); response.sendStatus(500); return; }
        response.sendStatus(200);
      });
    };
  }

  public end(): RequestHandler {
    return (request: Request, response: Response): void => {
      if (request.body.uid === undefined) {
        response.sendStatus(500);
        return;
      }
      forever.list("", (error: any, data: any[]) => {
        if (error) { response.sendStatus(500); return; }

        const foreverInstance = data.find((forever: any) => forever.uid === request.body.uid);
        if (foreverInstance !== undefined) {
          childProcess.exec(`forever stop ${foreverInstance.uid}`, (error: any) => {
            if (error) { console.log(error); response.sendStatus(500); return; }
            response.sendStatus(200);
          });
        }
      });
    };
  }
}
