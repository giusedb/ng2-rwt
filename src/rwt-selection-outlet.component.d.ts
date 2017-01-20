import { OnInit } from '@angular/core';
import { RwtService, RwtServed } from './rwt.service';
export declare class RwtSelectionOutletComponent extends RwtServed implements OnInit {
    item: any;
    resource: string;
    persistent: boolean;
    constructor(rwt: RwtService);
    ngOnInit(): void;
}
