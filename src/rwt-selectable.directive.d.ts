import { ElementRef, OnDestroy } from '@angular/core';
import { RwtService } from './rwt.service';
export interface IRwtSelectableData {
    bindTo: any;
}
export declare class RwtSelectableDirective implements OnDestroy {
    private rwt;
    private er;
    protected ref: any;
    protected selected: boolean;
    protected eSelection: number;
    protected eUnSelection: number;
    constructor(rwt: RwtService, er: ElementRef);
    rwtSelectable: any;
    ngOnDestroy(): void;
    click(): boolean;
}
