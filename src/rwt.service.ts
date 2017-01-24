import { Injectable, ApplicationRef, Optional, OnDestroy, ViewContainerRef } from '@angular/core';
import { RwtModuleConfig } from './shared';

declare let rwt;
declare var Lazy;
declare var window;

if (!window) {
  // tslint:disable-next-line:no-shadowed-variable
  let window = this;
}

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
  get (modelName: string, ids: Array<number>): Promise<any>;
  query (modelName: string, filter: Object);
  addModelHandler(modelName: string, decorator: IDecoratorFunction): void;
  addPersistentAttributes(modelName: string, attributes: Array<string>): void;
  on(eventName: string, eventHandler: Function);
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

@Injectable()
export class RwtService {
  public orm: ORM;
  private initialized: boolean;
  private singleSelections: Object = {};
  private multiSelections: Object = {};
  public on: Function;
  public get: Function;
  public emit: Function;
  public query: Function;
  public addModelHandler: Function;
  public unbind: Function;
  public persistentSelections: any= {};

  constructor(config: RwtModuleConfig , private app: ApplicationRef) {
    let orm: ORM = this.orm = new rwt(config.endPoint, config.loginFunction);
    window.orm = orm;
    orm.on('got-data', function(){
      app.tick();
    });
    this.on = orm.on.bind(orm);
    this.get = orm.get.bind(orm);
    this.emit = orm.emit.bind(orm);
    this.unbind = orm.unbind.bind(orm);
    orm.unbind((<any>orm).$orm.validationEvent);
  }

  public select(obj: any) {
    let resource = obj.constructor.modelName;
    if (this.singleSelections[resource]) { this.emit('unselected-' + resource, this.singleSelections[resource]); }
    this.singleSelections[resource] = obj;
    this.emit('selected-' + resource, obj);
    if (resource in this.persistentSelections) {
      this.savePersistent(resource, obj.id);
    }
    this.app.tick();
  }

  private savePersistent(resource: string, value: number) {
    localStorage['pS:' + resource] = value;
  }

  public makePersistentSelection(resource: string) {
    this.persistentSelections[resource] = true;
  }

  public getSelectionFor(resource: string ): any {
    if (resource in this.singleSelections) {
      return this.singleSelections[resource];
    }
    let key: string = 'pS:' + resource;
    if (key in localStorage) {
      let self = this;
      // tslint:disable-next-line:radix
      let ids: any = parseInt(localStorage[key]);
      this.orm.get(resource, ids).then(function(item: any){
        if (item) {
          self.select(item);
        }
      });
    }
    return null;
  }

  public toggleMulti(name: string, obj: any) {
    if (!(name in this.multiSelections)) {
      this.multiSelections[name] = {};
    }
    if (obj.id in this.multiSelections[name]) {
      delete this.multiSelections[name][obj.id];
      obj.$multiselected = false;
    } else {
      this.multiSelections[name][obj.id] = obj;
      obj.$multiselected = true;
    }
    this.emit('update-multiselection-' + name, this.getMultiSelection(name));
  }


  public selectMulti(name: string, obj: any) {
    if (!(name in this.multiSelections)) {
      this.multiSelections[name] = {};
    }
    this.multiSelections[name][obj.id] = obj;
    obj.$multiselected = true;
    this.emit('update-multiselection-' + name, this.getMultiSelection(name));
  }

  public unSelectMulti(name: string, obj: any) {
    if (!(name in this.multiSelections)) {
      this.multiSelections[name] = {};
    }
    if (obj.id in this.multiSelections[name]) {
      delete this.multiSelections[name][obj.id];
      obj.$multiselected = false;
    }
    this.emit('update-multiselection-' + name, this.getMultiSelection(name));
  }

  public getMultiSelection(name: string): Array<any> {
    return Lazy(this.multiSelections[name]).values().toArray();
  }
}

export class RwtServed  implements OnDestroy {
  protected eventHandlers: number[] = [];
  protected waiting: boolean = false;
  // tslint:disable-next-line:no-shadowed-variable
  constructor(protected rwt: RwtService) { }

  protected on (eventName: string, eventHandler: Function) {
    this.eventHandlers.push(this.rwt.on(eventName, eventHandler));
  }

  ngOnDestroy() {
    this.eventHandlers.forEach(<any>this.rwt.unbind);
  }
}
