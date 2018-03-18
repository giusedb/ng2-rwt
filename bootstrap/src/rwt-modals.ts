import { Directive, Component, Input, ElementRef, OnDestroy, HostListener, ApplicationRef, ViewContainerRef,
         ViewEncapsulation, ChangeDetectorRef, OnInit, Output, EventEmitter, TemplateRef, ViewChild } from '@angular/core';

import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { ModalComponent, overlayConfigFactory, DialogRef } from 'angular2-modal';
import { IRwtFormOptions, RwtServed, RwtService, IError, RwtForm } from '../..';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[rwtAsk]',
    // tslint:disable-next-line:use-output-property-decorator
    outputs: ['accept', 'reject'],
    inputs: ['rwtTitle']
})
export class RwtAskDirective {
    protected text: string;
    protected rwtTitle: string;
    protected accept = new EventEmitter();
    protected reject = new EventEmitter();

    constructor(protected modal: Modal) {}

    @HostListener('click') click (evt) {
        const dialog = this.modal.confirm();
        if (this.rwtTitle) {
            dialog.title(this.rwtTitle);
        }
        dialog.message(this.text)
            .showClose(true)
            .open()
            .then(dialog => {
                dialog.result.then(result => {
                    this.accept.emit(result);
                }, result => {
                    this.reject.emit(result);
                });
            });
    }

    @Input() set rwtAsk (value: any) {
        this.text = value;
    }
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'rwt-error-handler',
  template: `
    <template [ngIf]="tracebacks.length">
        <div class="btn btn-danger" (click)="showLastTrace()">
            show last Traceback
        </div>
        <div class="btn btn-danger" [rwtToggle]="{bindTo: this, attribute: 'showingTraces'}" [class.active]="showingTraces">
            show all errors
        </div>
        <div class="card" *ngIf="showingTraces">
            <ul class="list-group">
                <li class="list-group-item" (click)="showError(error)" *ngFor="let error of tracebacks">
                    {{ error.exception }}
                </li>
            </ul>
        </div>
    </template>
    <template [ngIf]="errors.length">
        <div class="btn btn-secondary" (click)="showLastError()">
            show last error
        </div>
        <div [class.active]="showingErrors" class="btn btn-secondary" [rwtToggle]="{bindTo: this, attribute: 'showingErrors'}">
            show all errors
        </div>
        <div class="card" *ngIf="showingErrors">
            <ul class="list-group">
                <li class="list-group-item" (click)="showError(error)" *ngFor="let error of errors">
                    {{ error.time | date : 'dd/MM/yy hh:mm:ss'}}
                </li>
            </ul>
        </div>
    </template>
  `
})
export class RwtErrorHandlerComponent extends RwtServed implements OnInit, OnDestroy {
  public lastError: any;
  public lastTrace: IError;
  public errors: any[] = [];
  public tracebacks: Array<IError> = [];
  private currentDialog: DialogRef<any>;
  @ViewChild('modalError') public modalError: any;

  constructor(rwt: RwtService, private modal: Modal) {
    super(rwt);
  }

  ngOnInit() {
    this.on('error-json', function(error: IError){
      error.time = new Date();
      this.lastError = error;
      this.errors.push(error);
    }.bind(this));
    this.on('error-json-500', (error: IError) => {
        error.time = new Date();
        this.lastTrace = error;
        this.tracebacks.push(error);
        this.showLastTrace();
    });
  }

  showLastError() {
      this.showError(this.lastError);
  }

  showError(error) {
      this.modal.alert()
        .dialogClass('danger')
        .showClose(true)
        .title(error.time)
        .message(JSON.stringify(error))
        .open();
  }

  showLastTrace() {
      this.showTrace(this.lastTrace);
  }

  showTrace(error) {
      this.modal.alert()
        .dialogClass('danger')
        .showClose(true)
        .title('Exception ' + error.exception)
        .message('<pre>' + error.traceback.join('\n') + '</pre>')
        .open();
  }
}

@Component({
    selector: '[rwtModalForm]',
    exportAs: 'rwt-modal',
    template: `
    <template #modalContent let-dialog="dialogRef" let-ctx="dialogRef.context">
        <div class="modal-content">
            <div class="modal-header" *ngIf="title">
                <h2>
                    {{ title }}
                    <button aria-label="Close" class="close" type="button" (click)="dialog.close()">
                        <span aria-hidden="true">×</span>
                    </button>
                </h2>
            </div>
            <div class="modal-body">
                <div class="table table-striped"
                    [rwtTableForm]="formConfig" 
                    #form (sent)="dialog.close()">
                </div>
            </div>
            <div class="modal-footer">
                <div class="btn btn-primary"
                    *ngIf="form.edit"
                    (click)="form.submit()">
                    Save
                </div>
                <div class="btn btn-outline-secondary" (click)="dialog.close()">
                    Cancel
                </div>
            </div>
        </div>
    </template>
    <div class="btn btn-default">
        <ng-content></ng-content>
    </div>
    `
})
export class RwtModalForm extends RwtForm {
    protected formConfig: IRwtFormOptions;

    @ViewChild('modalContent') protected modalContent: TemplateRef<any>;

    protected modalDialog: DialogRef<any>;

    constructor(rwt: RwtService, protected modal: Modal, cd: ChangeDetectorRef) {
        super(rwt, cd);
    }

    @Input() set rwtModalForm (value: IRwtFormOptions ) {
        if (value.title) {
            this.title = value.title;
            delete value.title;
        }
        this.formConfig = value;
    }

    @HostListener('click') click (evt) {
        this.modal.open(
            this.modalContent,
            overlayConfigFactory({ isBlocking: false }, BSModalContext))
            .then(dialog => {
                this.modalDialog = dialog;
                dialog.result.then(result => {
                    console.log('result', result);
                });
            });
    }
}


@Component({
    selector: 'modalFormContent',
    encapsulation: ViewEncapsulation.None,
    template: `
        <div class="modal-content">
            <div class="modal-header" *ngIf="ctx.title">
                <h2>
                    {{ ctx.title }}
                    <button aria-label="Close" class="close" type="button" (click)="dialog.close()">
                        <span aria-hidden="true">×</span>
                    </button>
                </h2>
            </div>
            <div class="modal-body">
                <div class="table table-striped"
                    [rwtTableForm]="ctx.formConfig" 
                    #form (sent)="dialog.close()">
                </div>
            </div>
            <div class="modal-footer">
                <div class="btn btn-primary"
                    *ngIf="form.edit"
                    (click)="form.submit()">
                    Save
                </div>
                <div class="btn btn-outline-secondary" (click)="dialog.close()">
                    Cancel
                </div>
            </div>
        </div>
    `
})
export class ModalFormContentComponent implements ModalComponent<BSModalContext> {
  ctx: BSModalContext;
  constructor(public dialog: DialogRef<BSModalContext>) {
    this.ctx = dialog.context;
    this.dialog = dialog;
  }
}

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[rwtModalFormTable]',
  // tslint:disable-next-line:use-input-property-decorator
})
export class RwtModalFormTableDirective {
  dialog: DialogRef<ModalFormContentComponent>;
  context: any;
  constructor(
    private modal: Modal,
  ) { }

  @HostListener('click') click (evt) {
//    console.log('viewRef',this.viewRef);
    this.modal.open(
      ModalFormContentComponent,
      overlayConfigFactory(this.context, BSModalContext))
      .then((dialog) => {
        this.dialog = dialog;
        this.context.dialog = dialog;
      });
  }

  @Input() set rwtModalFormTable (value: IRwtFormOptions) {
    let title = null;
    if (value.title) {
        title = value.title;
        delete value.title;
    }
    this.context = {
        formConfig : value,
    };
    if (title) {
        this.context.title = title;
    }
  }
}


@Directive({
    selector: '[rwtModalForm]'
})
export class RwtModalFormDirective implements ModalComponent<BSModalContext> {
  ctx: BSModalContext;
  constructor(public dialog: DialogRef<BSModalContext>) {
    this.ctx = dialog.context;
  }
}
