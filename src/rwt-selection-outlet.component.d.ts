import { OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { RwtService, RwtServed } from './rwt.service';
export declare class RwtSelectionOutletComponent extends RwtServed implements OnInit {
    item: any;
    resource: string;
    persistent: boolean;
    constructor(rwt: RwtService);
    ngOnInit(): void;
}
export declare class RwtSelectionOutletDirective extends RwtServed implements OnInit {
    private template;
    private vRef;
    resource: string;
    _i: any;
    persistent: boolean;
    constructor(rwt: RwtService, template: TemplateRef<any>, vRef: ViewContainerRef);
    item: any;
    rwtSelectionOutlet: any;
    ngOnInit(): void;
}
