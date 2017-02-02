import { ApplicationRef, OnDestroy } from '@angular/core';
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
export declare type Fields = {
    string: IRwtField;
};
export declare type FunctionObject = {
    string: Function;
};
export interface ILoginResult {
    status: string;
    error?: string;
    userid?: number;
}
export interface ORM {
    new (endPoint: string, loginFunction: Function): any;
    get(modelName: string, filter?: number | number[] | Object): Promise<any>;
    addModelHandler(modelName: string, decorator: IDecoratorFunction): void;
    addPersistentAttributes(modelName: string, attributes: Array<string>): void;
    on(eventName: string, eventHandler: Function): number;
    emit(eventName: string, [args]: [any]): number;
    unbind(handlerId: number): number;
    getModel(modelName: string): any;
    getLoggedUser(): Promise<any>;
    login(username: string, password: string): Promise<ILoginResult>;
    logout(url?: string): Promise<void>;
    connect(): Promise<number>;
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
        tzOffset: Date;
        xdr(url: string, data: any, application: string, token: string, formEncode: boolean): Promise<any>;
    };
}
export declare class RwtService {
    private app;
    orm: ORM;
    private initialized;
    private singleSelections;
    private multiSelections;
    get: Function;
    emit: Function;
    addModelHandler: Function;
    unbind: Function;
    persistentSelections: any;
    ready: boolean;
    private waitingEvents;
    constructor(app: ApplicationRef);
    /**
     * Connect Rwt with its base end point
     */
    connect(endPoint: string): void;
    on(eventName: string, handler: Function): number;
    select(obj: any): void;
    private savePersistent(resource, value);
    makePersistentSelection(resource: string): void;
    getSelectionFor(resource: string): any;
    toggleMulti(name: string, obj: any): void;
    selectMulti(name: string, obj: any): void;
    unSelectMulti(name: string, obj: any): void;
    getMultiSelection(name: string): Array<any>;
}
export declare class RwtServed implements OnDestroy {
    protected rwt: RwtService;
    protected eventHandlers: number[];
    protected waiting: boolean;
    constructor(rwt: RwtService);
    protected on(eventName: string, eventHandler: Function): number;
    ngOnDestroy(): void;
}
