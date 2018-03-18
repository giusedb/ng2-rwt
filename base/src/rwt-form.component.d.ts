import { ChangeDetectorRef, Type } from '@angular/core';
import { RwtService } from './rwt.service';
import { RwtForm } from './rwt-form';
import { IRwtFormOptions } from './interfaces';
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
