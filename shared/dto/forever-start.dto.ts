import { DTO } from "./dto";

export interface IForeverStart {
  uid?: string | null;
  command: string;
}

export interface IForeverStartDTO extends IForeverStart { } // tslint:disable-line:no-empty-interface
export interface IForeverStartJSON extends IForeverStart { } // tslint:disable-line:no-empty-interface

export class ForeverStartDTO extends DTO<IForeverStartDTO> implements IForeverStartDTO {

  public static parse(object: IForeverStartJSON): ForeverStartDTO {
    return new ForeverStartDTO({
      uid: object.uid ? object.uid : null,
      command: object.command,
    });
  }
  public uid?: string | null = null;
  public command: string;

  public serialize(): IForeverStartJSON {
    return {
      uid: this.uid,
      command: this.command,
    };
  }
}
