import { ApplicationRef, OnDestroy } from '@angular/core';
import { ORM } from './interfaces';
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
    orm: ORM;
    constructor(rwt: RwtService);
    protected on(eventName: string, eventHandler: Function): number;
    ngOnDestroy(): void;
}
