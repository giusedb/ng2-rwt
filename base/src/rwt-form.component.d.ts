import { ChangeDetectorRef, Type, EventEmitter, ElementRef } from '@angular/core';
import { ORM, RwtService, RwtServed, IRwtField, Fields } from './rwt.service';
import { RwtForm, IRwtFormOptions } from './rwt-form';
export declare class RwtForm2 extends RwtServed {
    protected cd: ChangeDetectorRef;
    static idx: number;
    formIdx: number;
    obj: any;
    protected oldObj: any;
    protected values: any;
    protected choiceItems: any;
    protected model: any;
    protected modelDef: any;
    protected orm: ORM;
    protected fields: Array<IRwtField>;
    protected fieldFilters: any;
    allFields: Array<any>;
    protected edit: boolean;
    title: string;
    protected showFields: Array<string>;
    ready: boolean;
    isNew: boolean;
    extraFields: Fields;
    errors: any;
    protected verb: string;
    protected originalObject: any;
    private transFieldFunction;
    protected mainForm: ElementRef;
    constructor(rwt: RwtService, cd: ChangeDetectorRef);
    waiting: boolean;
    sent: EventEmitter<{}>;
    private updateObject();
    private resolveReferences();
    /**
     * create an editable copy of real object
     * backup an original copy and acquire remoe references if any
     */
    private acquireObject(obj);
    /**
     * Update field definition deeply
     */
    private updateFields();
    private fetchAlternatives();
    private finalize(editable);
    setAttributes(attributes: IRwtFormOptions): void;
    editable: boolean;
    gotModel(model: any): void;
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
export declare function createFeModel(editableTemplates?: any, staticTemplates?: any): Type<any>;
export declare const RwtFeModelComponent: Type<any>;
