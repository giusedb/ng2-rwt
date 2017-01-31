import { Component, Input, ChangeDetectorRef, ElementRef } from '@angular/core';
import { RwtService, RwtForm, IRwtFormOptions } from '../..';

@Component({
  // tslint:disable-next-line:component-selector
  selector: '[rwtTableForm]',
  // tslint:disable-next-line:use-input-property-decorator
  inputs: ['rwtTableForm'],
  template: `
    <span *ngIf="waiting">
      Waiting ..... 
    </span>
    <form novalidate (submit)="submit()" #mainForm>
      <table [class]="classes">
          <tr *ngIf="title" scope="row">
              <th colspan="2">
                  {{ title }}
              </th>
          </tr>
          <tr *ngFor="let field of fields">
              <td><label for="{{ field.id }}"><b>{{ field.name }}</b></label></td>
              <td [rwtFeModel]="field.id" [form]="this"></td>
          </tr>
          <input type="submit" [hidden]="true">
      </table>
      {{ obj | json }}
    </form>
  `,
})
export class RwtTableFormComponent extends RwtForm {
  classes: string;

  constructor(rwt: RwtService, cd: ChangeDetectorRef, er: ElementRef) {
    super(rwt, cd);
    this.classes = er.nativeElement.getAttribute('class');
    er.nativeElement.setAttribute('class', '');
  }

  set rwtTableForm(value: IRwtFormOptions) {
    super.setAttributes(value);
  }
}