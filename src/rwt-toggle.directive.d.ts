import { ChangeDetectorRef } from '@angular/core';
export declare class RwtToggleDirective {
    private cd;
    private attrName;
    obj: any;
    constructor(cd: ChangeDetectorRef);
    rwtToggle: any;
    click(): boolean;
}
