import { OnInit, ApplicationRef, ElementRef, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { RwtService } from './rwt.service';
import { ORM } from './interfaces';
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
    protected ready: boolean;
    select: Function;
    /**
     * Fetches needed dat from server
     */
    fetch(): void;
    /**
     * Called when items are updated
     * It understand if items are showables or not and remove or add items to this view
     */
    protected onUpdateItems(items: Array<any>): void;
    /**
     * Called when new items marked as deleted
     * It delete items
     */
    onDeleteItems(items: Array<number>): void;
    /**
     * Called when new items are fetched from client
     * It adds items to the view according with filters
     */
    onNewItems(items: any): void;
    constructor(rwt: RwtService, cd: ChangeDetectorRef);
    /**
     * main initialize funcion
     */
    rwtData: IRwtAttributes;
    ngOnInit(): void;
    ngOnDestroy(): void;
}
