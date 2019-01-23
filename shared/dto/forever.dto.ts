import { DTO } from "./dto";

export interface IForever {
  uid: string;
  command: string;
  script: string;
  fid: number;
  pid: number;
  startTime: number;
}

export interface IForeverDTO extends IForever { } // tslint:disable-line:no-empty-interface
export interface IForeverJSON extends IForever { } // tslint:disable-line:no-empty-interface

export class ForeverDTO extends DTO<IForeverDTO> implements IForeverDTO {

  public static parse(object: IForeverJSON): ForeverDTO {
    return new ForeverDTO({
      uid: object.uid,
      command: object.command,
      script: object.script,
      fid: object.fid,
      pid: object.pid,
      startTime: object.startTime,
    });
  }
  public uid: string;
  public command: string;
  public script: string;
  public fid: number;
  public pid: number;
  public startTime: number;

  public serialize(): IForeverJSON {
    return {
      uid: this.uid,
      command: this.command,
      script: this.script,
      fid: this.fid,
      pid: this.pid,
      startTime: this.startTime,
    };
  }
}
