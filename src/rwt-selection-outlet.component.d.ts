import { OnInit } from '@angular/core';
import { RwtService } from './rwt.service';
export declare class RwtSelectionOutletComponent implements OnInit {
    private rwt;
    item: any;
    resource: string;
    private eSelection;
    persistent: boolean;
    constructor(rwt: RwtService);
    ngOnInit(): void;
    ngOnDestroy(): void;
}
