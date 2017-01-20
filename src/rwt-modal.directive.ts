import { Directive, Input, ElementRef, OnDestroy, HostListener, ApplicationRef, ViewContainerRef } from '@angular/core';
import { Modal } from 'angular2-modal/plugins/vex';
import { RwtForm } from './rwt-form.component';

@Directive({
    selector: '[rwtModalForm]',
})
export class RwtModalFormDirective {
    protected formConfig: any;

    constructor(protected modal: Modal, protected app: ApplicationRef) {}

    @HostListener('click') click (evt) {
        console.log('click recv');
        console.log(this.formConfig);
        this.modal.confirm()
            .message('Sei sicuro')
            .open()
            .then(console.log, console.info);
    }

    @Input() set rwtModalForm (value: any) {
        this.formConfig = value;
    }
}
