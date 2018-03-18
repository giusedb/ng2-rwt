import { ElementRef } from '@angular/core';
import { RwtService, RwtServed } from './rwt.service';
export interface IRwtSelectableData {
    bindTo: any;
}
export declare class RwtSelectableDirective extends RwtServed {
    private er;
    protected ref: any;
    protected selected: boolean;
    constructor(rwt: RwtService, er: ElementRef);
    rwtSelectable: any;
    click(): boolean;
}
