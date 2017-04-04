export interface IModel extends Object {
  modelName: string;
  fields: Object;
  prototype: Object;
}

export interface IDecoratorFunction {
  (model: IModel): void;
}

export interface IRwtFieldValidator {
  valid?: Array<Array<string>>;
  min?: number;
  max?: number;
  minlength?: number;
  maxlength?: number;
  pattern?: string;
  required?: boolean;
}

export interface IRwtField {
  id: string;
  name?: string;
  type?: string;
  readable?: boolean;
  writable?: boolean;
  validators?: IRwtFieldValidator;
  to?: string;
  widget?: string;
}

export interface IRwtValidationError {
  _resource: string;
  errors: any;
}

export type Fields = { string: IRwtField };

export type FunctionObject = {string: Function };

export interface ILoginResult {
  status: string;
  error?: string;
  userid?: number;
}

export interface ORM {
  new(endPoint: string, loginFunction: Function);
  get (modelName: string, filter?: number | number[] | Object ): Promise<any>;
//  query (modelName: string, filter: Object);
  addModelHandler(modelName: string, decorator: IDecoratorFunction): void;
  addPersistentAttributes(modelName: string, attributes: Array<string>): void;
  on(eventName: string, eventHandler: Function): number;
  emit(eventName: string, [args]): number;
  unbind(handlerId: number): number;
  getModel(modelName: string): any;
  getLoggedUser(): Promise<any>;
  login(username: string, password: string): Promise<ILoginResult>;
  logout(url?: string): Promise<void>;
  connect(): Promise<number>;
  // tslint:disable-next-line:member-ordering
  utils: {
    bool(x): boolean;
    /**
     * Capitalize string
     */
    capitalize(name: string): string;
    /**
     * Clean all localStorage data
     */
    cleanStorage(): void;
    /**
     * Clean all model description from localStorage
     */
    cleanDescription(): void;
    hash(x: string): string;
    makeFilter(model: any, filter: any, unifier?: string): Function;
    mock(): any;
    noop(): void;
    permutations(x: any[]): any[];
    pluralize(s: string): string;
    reWheelConnection: any;
    sameAs(obj: any): boolean;
    transFieldType: FunctionObject;
    tzOffset: Date,
    xdr(url: string, data: any, application: string, token: string, formEncode: boolean): Promise<any>;
  };
}

export interface IRwtFormOptions {
  resource?: string;
  record?: number;
  object?: any;
  editable?: boolean;
  title?: string;
  showFields?: Array<string>;
  fieldDefs?: Fields;
  values?: any;
  verb?: string;
};
