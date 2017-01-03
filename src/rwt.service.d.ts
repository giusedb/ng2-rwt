import { ApplicationRef } from '@angular/core';
import { RwtModuleConfig } from './shared';
export interface IModel extends Object {
    modelName: string;
    fields: Object;
    prototype: Object;
}
export interface IDecoratorFunction {
    (model: IModel): void;
}
export interface IRwtField {
}
export interface ORM {
    new (endPoint: string, loginFunction: Function): any;
    get(modelName: string, ids: Array<number>): Promise<any>;
    query(modelName: string, filter: Object): any;
    addModelHandler(modelName: string, decorator: IDecoratorFunction): void;
    addPersistentAttributes(modelName: string, attributes: Array<string>): void;
    on(eventName: string, eventHandler: Function): any;
    emit(eventName: string, [args]: [any]): number;
    unbind(handlerId: number): number;
    getModel(modelName: string): any;
    utils: {
        makeFilter(model: any, filter: any, unifier?: string): Function;
        tzInfo: Date;
    };
}
export declare class RwtService {
    private app;
    orm: ORM;
    private initialized;
    private singleSelections;
    private multiSelections;
    on: Function;
    get: Function;
    emit: Function;
    query: Function;
    addModelHandler: Function;
    unbind: Function;
    persistentSelections: any;
    constructor(config: RwtModuleConfig, app: ApplicationRef);
    select(obj: any): void;
    private savePersistent(resource, value);
    makePersistentSelection(resource: string): void;
    getSelectionFor(resource: string): any;
    toggleMulti(name: string, obj: any): void;
    selectMulti(name: string, obj: any): void;
    unSelectMulti(name: string, obj: any): void;
    getMultiSelection(name: string): Array<any>;
}
