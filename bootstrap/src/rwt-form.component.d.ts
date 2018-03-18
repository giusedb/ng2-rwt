import { ChangeDetectorRef, ElementRef } from '@angular/core';
import { RwtService, RwtForm, IRwtFormOptions } from '../..';
export declare class RwtTableFormComponent extends RwtForm {
    classes: string;
    constructor(rwt: RwtService, cd: ChangeDetectorRef, er: ElementRef);
    rwtTableForm: IRwtFormOptions;
}
