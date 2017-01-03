import { OnInit, ApplicationRef, ElementRef, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ORM, RwtService } from './rwt.service';
export interface IRwtAttributes {
    resource: string;
    filter: Object;
    persistentAttributes: Array<string>;
}
export declare class RwtDataComponent implements OnInit, OnDestroy {
    protected resource: string;
    protected filter: Object;
    protected filterFunction: Function;
    protected items: Array<any>;
    protected orm: ORM;
    protected app: ApplicationRef;
    protected persistentAttributes: Array<string>;
    protected el: ElementRef;
    protected gotDataEventHandler: number;
    protected updateFilterHandler: number;
    protected newFilterHandler: number;
    protected deleteFilterHandler: number;
    select: Function;
    fetch(): void;
    onUpdateItems(items: Array<any>): void;
    onDeleteItems(items: Array<number>): void;
    onNewItems(items: any): void;
    constructor(rwt: RwtService, cd: ChangeDetectorRef);
    rwtData: IRwtAttributes;
    ngOnInit(): void;
    ngOnDestroy(): void;
}
