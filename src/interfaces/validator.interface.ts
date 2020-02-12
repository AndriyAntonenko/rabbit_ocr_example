export interface Validator {
  validate(data: any): Promise<any>;
}
