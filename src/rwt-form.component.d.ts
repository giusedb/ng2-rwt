import { OnInit, ChangeDetectorRef, Type } from '@angular/core';
import { ORM, RwtService } from './rwt.service';
export interface IRwtFormOptions {
    resource?: string;
    record?: number;
    object?: any;
    editable?: boolean;
    title?: string;
    showFields?: Array<string>;
    templateUrl?: string;
}
export declare class RwtForm implements OnInit {
    protected rwt: RwtService;
    protected cd: ChangeDetectorRef;
    static idx: number;
    formIdx: number;
    obj: any;
    protected oldObj: any;
    protected model: any;
    protected modelDef: any;
    protected orm: ORM;
    protected fields: Array<any>;
    allFields: Array<any>;
    protected edit: boolean;
    title: string;
    protected showFields: Array<string>;
    ready: boolean;
    isNew: boolean;
    constructor(rwt: RwtService, cd: ChangeDetectorRef);
    ngOnInit(): void;
    setAttributes(attributes: IRwtFormOptions): void;
    editable: boolean;
    gotModel(model: any, callBack?: Function): void;
    toggleEdit(): void;
    submit(): void;
}
export declare class RwtFormInlineComponent extends RwtForm {
    constructor(rwt: RwtService, cd: ChangeDetectorRef);
    rwtFormInline: IRwtFormOptions;
}
export declare class RwtFormTemplateComponent extends RwtForm {
    constructor(rwt: RwtService, cd: ChangeDetectorRef);
    rwtFormTemplate: IRwtFormOptions;
}
export declare function createFeModel(typeTemplates: any): Type<any>;
export declare const RwtFeModelComponent: Type<any>;
