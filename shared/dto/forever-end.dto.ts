import { DTO } from "./dto";

export interface IForeverEnd {
  uid: string;
}

export interface IForeverEndDTO extends IForeverEnd { } // tslint:disable-line:no-empty-interface
export interface IForeverEndJSON extends IForeverEnd { } // tslint:disable-line:no-empty-interface

export class ForeverEndDTO extends DTO<IForeverEndDTO> implements IForeverEndDTO {

  public static parse(object: IForeverEndJSON): ForeverEndDTO {
    return new ForeverEndDTO({
      uid: object.uid,
    });
  }
  public uid: string;
  public command: string;

  public serialize(): IForeverEndJSON {
    return {
      uid: this.uid,
    };
  }
}
