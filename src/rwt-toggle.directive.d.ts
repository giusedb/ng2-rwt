import { ChangeDetectorRef } from '@angular/core';
export declare class RwtToggleDirective {
    private cd;
    private attrName;
    obj: any;
    constructor(cd: ChangeDetectorRef);
    rwtToggle: any;
    click(): boolean;
}
export declare class RwtSetDirective {
    private cd;
    private attrName;
    obj: any;
    value: any;
    constructor(cd: ChangeDetectorRef);
    rwtSet: any;
    click(): boolean;
}
