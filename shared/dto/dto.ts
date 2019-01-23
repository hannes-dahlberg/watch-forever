export class DTO<T extends { [key: string]: any }> {

  public static parse(object: any): DTO<any> { return {} as DTO<any>; }
  public constructor(properties: T) {
    Object.keys(properties).forEach((key: string) => {
      (this as any)[key] = properties[key];
    });
  }
}
