import { OnInit } from '@angular/core';
import { RwtService } from './rwt.service';
export interface IRwtMultiSelectable {
    name: string;
    sortBy?: string;
    sortDirection?: string;
}
export declare class RwtMultiselectionOutletComponent implements OnInit {
    protected rwt: RwtService;
    selected: Array<any>;
    name: string;
    sortOrder: string;
    sortDirection: boolean;
    eSelected: number;
    constructor(rwt: RwtService);
    ngOnInit(): void;
    rwtMultiselectionOutlet: IRwtMultiSelectable;
}
