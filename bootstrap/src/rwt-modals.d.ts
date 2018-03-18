import { OnDestroy, ChangeDetectorRef, OnInit, EventEmitter, TemplateRef } from '@angular/core';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { ModalComponent, DialogRef } from 'angular2-modal';
import { IRwtFormOptions, RwtServed, RwtService, IError, RwtForm } from '../..';
export declare class RwtAskDirective {
    protected modal: Modal;
    protected text: string;
    protected rwtTitle: string;
    protected accept: EventEmitter<{}>;
    protected reject: EventEmitter<{}>;
    constructor(modal: Modal);
    click(evt: any): void;
    rwtAsk: any;
}
export declare class RwtErrorHandlerComponent extends RwtServed implements OnInit, OnDestroy {
    private modal;
    lastError: any;
    lastTrace: IError;
    errors: any[];
    tracebacks: Array<IError>;
    private currentDialog;
    modalError: any;
    constructor(rwt: RwtService, modal: Modal);
    ngOnInit(): void;
    showLastError(): void;
    showError(error: any): void;
    showLastTrace(): void;
    showTrace(error: any): void;
}
export declare class RwtModalForm extends RwtForm {
    protected modal: Modal;
    protected formConfig: IRwtFormOptions;
    protected modalContent: TemplateRef<any>;
    protected modalDialog: DialogRef<any>;
    constructor(rwt: RwtService, modal: Modal, cd: ChangeDetectorRef);
    rwtModalForm: IRwtFormOptions;
    click(evt: any): void;
}
export declare class ModalFormContentComponent implements ModalComponent<BSModalContext> {
    dialog: DialogRef<BSModalContext>;
    ctx: BSModalContext;
    constructor(dialog: DialogRef<BSModalContext>);
}
export declare class RwtModalFormTableDirective {
    private modal;
    dialog: DialogRef<ModalFormContentComponent>;
    context: any;
    constructor(modal: Modal);
    click(evt: any): void;
    rwtModalFormTable: IRwtFormOptions;
}
export declare class RwtModalFormDirective implements ModalComponent<BSModalContext> {
    dialog: DialogRef<BSModalContext>;
    ctx: BSModalContext;
    constructor(dialog: DialogRef<BSModalContext>);
}
