import { Directive, Component, Input, ElementRef, OnDestroy, HostListener, ApplicationRef, ViewContainerRef,
         OnInit, Output, EventEmitter, TemplateRef, ViewChild } from '@angular/core';

import { Modal } from 'angular2-modal/plugins/vex';
import { ModalComponent, overlayConfigFactory, DialogRef } from 'angular2-modal';
import { IRwtFormOptions, RwtServed, RwtService, IError } from '../..';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[rwtAsk]',
})
export class RwtAskDirective {
    protected text: string;
    @Output('accept') protected accept = new EventEmitter();
    @Output('reject') protected reject = new EventEmitter();

    constructor(protected modal: Modal) {}

    @HostListener('click') click (evt) {
        this.modal.confirm()
            .message(this.text)
            .open()
            .then(dialog => {
                dialog.result.then(result => {
                    this.accept.emit(result);
                }, result => {
                    this.reject.emit(false);
                });
            });
    }

    @Input() set rwtAsk (value: any) {
        this.text = value;
    }
}

@Component({
    // tslint:disable-next-line:directive-selector
    selector: '[rwtModalForm]',
    template: `
    <template #modalContent>
        <div class="vex-content">
            <div class="vex-dialog-form">
                <div class="vex-dialog-message">
                    <table [rwtTableForm]="formConfig" #form
                            class="table" 
                            (sent)="dismiss()"></table>
                </div>
                <div class="vex-dialog-buttons">
                    <button type="button" 
                            (click)="form.submit()"
                            class="vex-dialog-button-primary vex-dialog-button vex-first">Ok</button>
                    <button type="button"
                            (click)="this.dismiss()"
                            class="vex-dialog-button-secondary vex-dialog-button vex-last">Cancel</button>
                </div>
            </div>
        </div>
    </template>
    <ng-content></ng-content>
    `,
})
export class RwtModalFormDirective {
    protected formConfig: IRwtFormOptions;
    protected currentDialog: DialogRef<any>;
    @ViewChild('modalContent') protected modalContent: TemplateRef<any>;
    vito = 'Alby';

    constructor(protected modal: Modal) {}

    @HostListener('click') click (evt) {
        this.modal.open(this.modalContent, overlayConfigFactory({className : 'default', contentClassName: 'vex'}))
            .then(dialog => {
                this.currentDialog = dialog;
            });
    }

    @Input() set rwtModalForm(value) {
        this.formConfig = value;
    }

    dismiss() {
        this.currentDialog.dismiss();
    }
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'rwt-error-handler',
  template: `
    <template #modalError>
        <div class="vex-content">
            <div class="vex-dialog-form">
                <div class="vex-dialog-message">
                    <h3>
                        Error
                    </h3>
                    <p>
                        Server returned following error:
                    </p>
                    {{ exception }}<br>
                    <p *ngFor="let line of traceBack">{{line}}<p>
                </div>
                <div class="vex-dialog-buttons">
                    <button type="button"
                            (click)="currentDialog.dismiss()"
                            class="vex-dialog-button-secondary vex-dialog-button vex-last">Ok</button>
                </div>
            </div>
        </div>
    </template>
  `
})
export class RwtErrorHandlerComponent extends RwtServed implements OnInit, OnDestroy {
  public lastError: IError;
  public errors: Array<IError> = [];
  private exception: string;
  private traceBack: string[];
  private currentDialog: DialogRef<any>;
  @ViewChild('modalError') public modalError: any;

  constructor(rwt: RwtService, private modal: Modal) {
    super(rwt);
  }

  ngOnInit() {
    this.on('error-json', function(error: IError){
      this.lastError = error;
      this.errors.push(error);
    }.bind(this));
    this.on('error-json-500', (error) => {
      this.exception = error.exception;
      this.traceBack = error.traceback;
      this.modal.open(this.modalError, overlayConfigFactory({className : 'default', contentClassName: 'vex'}))
        .then(dialog => {
            this.currentDialog = dialog;
        });
    });
  }
}
