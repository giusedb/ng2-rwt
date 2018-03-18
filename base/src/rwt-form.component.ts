
// tslint:disable-next-line:max-line-length
import { Component, OnInit, OnDestroy, Input, Output, HostListener, ChangeDetectorRef, ComponentFactoryResolver, Type, EventEmitter, ViewChild, ViewChildDecorator, ElementRef } from '@angular/core';
import { RwtService, RwtServed } from './rwt.service';
import { ORM, IRwtField,  Fields, IRwtValidationError } from './interfaces';
import { Choice, RwtForm } from './rwt-form';
import { IRwtFormOptions } from './interfaces';

declare var Lazy;

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'rwt-form-inline',
  template: `
  <form novalidate (submit)="submit()">
    {{ title }}
    <ng-content></ng-content>
  </form>`,
})
export class RwtFormInlineComponent extends RwtForm {
  constructor(rwt: RwtService, cd: ChangeDetectorRef) {
    super(rwt, cd);
  }
  @Input() set rwtFormInline (value: IRwtFormOptions) {
    super.setAttributes(value);
  }
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: '[rwtFormTemplate]',
  template: 'rwt form with template {{ template }}'
})
export class RwtFormTemplateComponent extends RwtForm {
  constructor(rwt : RwtService, cd: ChangeDetectorRef) {
    super(rwt, cd);
  }

  @Input() set rwtFormTemplate(value: IRwtFormOptions) {
    super.setAttributes(value);
  }
}

export function createFeModel(editableTemplates: any = {}, staticTemplates: any = {}): Type<any> {
  // editable templates
  let defaultTemplates = {
    // tslint:disable-next-line:max-line-length
    integer: '<input [required]="required" [min]="min" [max]="max" [(ngModel)]="form.obj[fieldName]" class="form-control" placeholder="{{ field.name }}" type="number">',
    float: '<input [required]="required" [min]="min" [max]="max" [(ngModel)]="form.obj[fieldName]" class="form-control" placeholder="{{ field.name }}" type="number">',
    // tslint:disable-next-line:max-line-length
    boolean: '<input [required]="required" [(ngModel)]="form.obj[fieldName]" class="form-control" placeholder="{{ field.name }}" type="checkbox">',
    text: '<textarea [pattern]="pattern" [minlength]="minlength" [maxlength]="maxlength" [required]="required" [(ngModel)]="form.obj[fieldName]" class="form-control" placeholder="{{ field.name }}"></textarea>',
    // tslint:disable-next-line:max-line-length
    default: '<input [required]="required" [pattern]="pattern" [minlength]="minlength" [maxlength]="maxlength" [(ngModel)]="form.obj[fieldName]" class="form-control" placeholder="{{ field.name }}" type="text">',
    id: '{{ value }}',
    choices: `<select [required]="required" [(ngModel)]="form.obj[fieldName]">
                  <option [ngValue]="choice" *ngFor="let choice of form.choiceItems[fieldName]">{{ choice }}</option>
              </select>`,
    date: '<input [required]="required" type="date" [(ngModel)]="form.obj[fieldName]">',
    error: '<div class="rwt-error" *ngIf="form.edit && form.errors[fieldName]">{{ form.errors[fieldName] }}</div>',
    // tslint:disable-next-line:max-line-length
    password: '<input [required]="required" [pattern]="pattern" [minlength]="minlength" [maxlength]="maxlength" [(ngModel)]="form.obj[fieldName]" class="form-control" placeholder="{{ field.name }}" type="password">',
  };
  let typeTemplates = Lazy(defaultTemplates)
    .keys()
    .concat(Lazy(editableTemplates).keys())
    .unique()
    .map((fieldType: string) => [fieldType, (fieldType in editableTemplates) ? editableTemplates[fieldType] : defaultTemplates[fieldType]])
    .toObject();

  let errorTemplate: string = typeTemplates.error;
  let defaultWidget = typeTemplates.default;
  delete typeTemplates.error;
  delete typeTemplates.default;
  let fieldTypeTemplates = Lazy(typeTemplates).map((v, k) => '<template ngSwitchCase="' + k + '">' + v + '</template>\n').toString();

  // static templates
  let defaultStatic = '{{ form.obj[fieldName]}}';
  if ('default' in staticTemplates) {
    defaultStatic = staticTemplates.default;
    delete staticTemplates.default;
  }
  let staticTemplate = Lazy(staticTemplates)
    .map((template, fieldName) => '<template ngSwitchCase="' + fieldName + '">' + template + '</template>\n')
    .toString();

  console.log(staticTemplate);

  let template = `
      <template [ngIf]="form.ready">
        <template [ngIf]="form.edit && field.writable">
          <span [ngSwitch]="field.widget">
        `
        + fieldTypeTemplates +
          ` <template ngSwitchDefault>` + defaultWidget + `</template>
          </span>
        </template>
        <template [ngIf]="!(form.edit && field.writable) && form.obj">
          <span [ngSwitch]="field.widget">`
            + staticTemplate +
          ` <template ngSwitchDefault>` +
             defaultStatic +
            `</template>
          </span>
        </template>
        <template [ngIf]="form.errors[fieldName]">` + errorTemplate + `</template>
      </template>
    `;
  @Component({
    // tslint:disable-next-line:component-selector
    selector: '[rwtFeModel]',
    // tslint:disable-next-line:use-input-property-decorator
    inputs: ['form'],
    template: template,
  })
  // tslint:disable-next-line:component-class-suffix
  class RwtFeModel implements OnInit {
    public form: RwtForm;
    public field: IRwtField;
    public fieldName: string;
    public min: number;
    public max: number;
    public required: boolean;
    public minlength: number;
    public maxlength: number;
    public pattern: string;


    public set value(val) {
      this.form.obj[this.fieldName] = val;
    }
    public get value() {
      return this.form.obj[this.fieldName];
    }

    @Input() set rwtFeModel (value: string) {
      this.fieldName = value;
      this.field = this.form.allFields[value];
      this.value = this.form.obj[value];
      // if field has validators
      // assuming them as part of Component
      let names = {
        required: 1,
        min: 1,
        max: 1,
        minlength: 1,
        maxlength: 1,
        pattern: 1,
      };
      if (this.field.validators) {
        for (let name in this.field.validators) {
          if (name in names) {
            this[name] = this.field.validators[name];
          }
        }
      }
    }

    ngOnInit() {

    }
  }
  return RwtFeModel;
}

declare let require;

let types = {};
let statics = {};
try {
  let tw = require('type-widgets.js');
  types = tw.templateWidgets;
  if (tw.templateStatics){
    statics = tw.templateStatics;
  }
  // tslint:disable-next-line:no-console
  console.info('found custom field types for ' + Lazy(types).keys().toArray().join(', '));
} catch (e) {
  console.warn('field-types.js is not found', e);
}
export const RwtFeModelComponent: Type<any> = createFeModel(types, statics);
