import { RwtService } from './rwt.service';
export declare class RwtMultiselectableDirective {
    private rwt;
    private obj;
    private name;
    constructor(rwt: RwtService);
    rwtMultiselectable: any;
    click(evt: Event): void;
}
