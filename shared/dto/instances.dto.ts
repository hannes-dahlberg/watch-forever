import { DTO } from "./dto";

export interface IInstances {
  project: string;
  path: string;
}

export interface IInstancesDTO extends IInstances { } // tslint:disable-line:no-empty-interface
export interface IInstancesJSON extends IInstances { } // tslint:disable-line:no-empty-interface

export class InstancesDTO extends DTO<IInstancesDTO> implements IInstancesDTO {

  public static parse(object: IInstancesJSON): InstancesDTO {
    return new InstancesDTO({
      project: object.project,
      path: object.path,
    });
  }
  public project: string;
  public path: string;

  public serialize(): IInstancesJSON {
    return {
      project: this.project,
      path: this.path,
    };
  }
}
