
// tslint:disable-next-line:max-line-length
import { Component, OnInit, OnDestroy, Input, Output, HostListener, ChangeDetectorRef, ComponentFactoryResolver, Type, EventEmitter, ViewChild, ViewChildDecorator, ElementRef } from '@angular/core';
import { ORM, RwtService, RwtServed, IRwtField,  Fields, IRwtValidationError } from './rwt.service';

declare var Lazy;

export class Choice {
  public id: any;
  private text: string;
  constructor(element: any) {
    if (element && (element.constructor === Array)) {
      this.id = element[0];
      this.text = (element.length === 0) ? this.id : element[1];
    } else {
      this.id = element;
      this.text = element.toString();
    }
  }

  toString() {
    return this.text;
  }
}

export interface IRwtFormOptions {
  resource?: string;
  record?: number;
  object?: any;
  editable?: boolean;
  title?: string;
  showFields?: Array<string>;
  fieldDefs?: Fields;
  values?: any;
  verb?: string;
}

export class RwtForm extends RwtServed {
  public static idx: number = 0;
  public formIdx: number;
  public obj: any;
  protected oldObj: any;
  protected values: any;
  protected choiceItems: any = {}; // { field name : }

  protected model: any;
  protected modelDef: any;
  protected orm: ORM;
  protected fields: Array<IRwtField>;
  protected fieldFilters: any = {};
  public allFields: Array<any>;
  protected edit: boolean = false;
  public title: string = null;
  protected showFields: Array<string>;
  public ready: boolean = false;
  public isNew: boolean = false;
  public extraFields: Fields;
  public errors: any = {};
  protected verb: string;
  protected originalObject: any;
  private transFieldFunction: any = {};
  @ViewChild('mainForm') protected mainForm: ElementRef;

  constructor(rwt: RwtService, protected cd: ChangeDetectorRef) {
    super(rwt);
    this.orm = rwt.orm;
    this.formIdx = RwtForm.idx ++;
  }


  public get waiting () {
    return !this.ready;
  }
  public set waiting (value: boolean) {
    this.ready = !value;
  }

  // tslint:disable-next-line:member-ordering
  @Output() sent = new EventEmitter();

  private updateObject() {
    if (this.values) {
      // update each object key
      Lazy(this.values).each((v, k) => {
        this.obj[k] = v;
      });
    }
  }

  private resolveReferences() {
    this.fields.filter(field => field.type === 'reference').forEach(field => {
      if (typeof this.obj[field.id] === 'number') {
        this.rwt.get(field.to, this.obj[field.id])
          .then(val => {
            this.obj[field.id] = val;
          });
      }
    });
  }

  private acquireObject(obj) {
    /**
     * create an editable copy of real object
     * backup an original copy and acquire remoe references if any
     */
    if (obj) {
      this.originalObject = obj;
      this.oldObj = obj.asRaw();
    }
    // make a copy
    return Lazy(this.oldObj).toObject();
  }

  private updateFields() {
    /**
     * Update field definition deeply
     */
    let extras = [];
    if (this.extraFields) {
      // integrate field default
      Lazy(this.extraFields)
        .filter((field, fieldName) => !(fieldName in this.allFields))
        .each((field, fieldName) => {
          // setting id as field name
          if (!('id' in field)) {
            field.id = fieldName;
          }
          // setting name as capitalized field name
          if (!('name' in field)) {
            field.name = fieldName.split(' ').map(this.orm.utils.capitalize).join(' ');
          }
          if (!('type' in field)) {
            field.widget = 'string';
            field.type = 'string';
          }
          if (!('writable' in field) && !('readable' in field)) {
            field.writable = true;
          }
      });

      // deep merge for each field
      Lazy(this.extraFields).each((v, k) => {
        if (typeof v === 'object') {
          let exists = false;
          if (!(k in this.allFields)) {
            this.allFields[k] = {};
          } else {
            exists = true;
          }
          v = Lazy(this.allFields[k])
            .merge(v)
            .toObject();
        }
        this.allFields[k] = v;
      });
      extras = Lazy(this.extraFields)
        .filter((fieldName, field) => !(fieldName in this.model.fields))
        .keys();
    }
    // redefine fields to show
    this.fields = Lazy(this.showFields)
      .concat(extras)
      .unique()
      .filter((f) => this.allFields[f].readable || this.allFields[f].writable)
      .map((f) => this.allFields[f]).toArray();

    this.fields.forEach((field) => {
      // if a field requires an fixed choice it will default to choiche widget
      if (field.validators && field.validators.valid) {
        if (field.widget === field.type) {
          field.widget = 'choices';
        }
        this.choiceItems[field.id] = Lazy(field.validators.valid)
          .map((x) => new Choice(x)).toArray();
      }
    });
    // waiting for references resolution
    let missingReferences = this.fields.filter(
      (field) => field.type === 'reference'
    );
    let referenceLen = missingReferences.length;
    if (referenceLen && this.originalObject) {
      for (let field of missingReferences){
        let val = this.originalObject['_' + field.id];
        if (val) {
          this.rwt.get(field.to, val)
            .then((x) => {
              referenceLen --;
              if (!referenceLen) {
                this.obj = this.acquireObject(this.originalObject);
                this.ready = true;
                this.cd.detectChanges();
              }
            });
        } else {
          referenceLen--;
        }
      }
    }
    return !(referenceLen && this.originalObject);
  }

  private finalize(editable: boolean) {
    /**
     * Finalizes object and field creation
     */
    this.ready = this.updateFields();
    this.updateObject();
    this.editable = editable || false;
    this.cd.detectChanges();
    this.resolveReferences();
  }

  public setAttributes(attributes: IRwtFormOptions) { 
    /**
     * Redefine all attributes for form rendering
     */
    let self = this;
    this.ready = false;
    this.title = attributes.title || null;
    this.showFields = attributes.showFields || null;
    this.extraFields = attributes.fieldDefs || null;
    this.values = attributes.values || {};
    this.verb = this.verb || null;
    this.errors = {};
    if (attributes.object) {
      this.isNew = false;
      this.gotModel(attributes.object.constructor);
      this.obj = this.acquireObject(attributes.object);
      this.finalize(attributes.editable);
    } else if (attributes.record) {
      let x: any = attributes.record;
      this.isNew = false;
      this.orm.get(attributes.resource, x).then(function(obj){
        if (obj) {
          attributes.object = obj;
          self.setAttributes(attributes);
        } else {
          console.error('Object ' + attributes.resource + ' with id ' + x + ' is unaccessible');
        }
      }, function(error){
        self.ready = true;
      });
    } else if (attributes.resource) {
      this.isNew = true;
      this.orm.getModel(attributes.resource)
        .then(this.gotModel.bind(this))
        .then(function(){
          self.obj = {};
          self.finalize(attributes.editable);
        });
    } else {
      // form is incomplete
      // this.finalize();
    }
  }

  get editable() { return this.edit; }
  set editable(value: boolean) {
    if (value !== this.edit) {
      let numChoiches = Lazy(this.fields)
        .filter((field) => (
          (field.type === 'reference')
          && (field.writable)))
        .size();
      // fetching choiches for references
      for (let field of this.fields){
        if ((field.type === 'reference') && (field.writable)) {
          this.ready = false;
          this.orm.query(<any>field.to, this.fieldFilters[field.id] || {})
            .then((references) => {
              this.choiceItems[field.id] = references;
              numChoiches --;
              if (numChoiches === 0) {
                this.ready = true;
                this.cd.markForCheck();
              }
            });
        }
      }
      if (value) {
        this.errors = {};
      } else {
        this.obj = Lazy(this.oldObj).toObject();
      }
      this.edit = value;
    }
  }

  gotModel(model: any, callBack?: Function) {
    this.model = model;
    // copy original model fields
    this.allFields = Lazy(model.fields).toObject();
    if (!this.showFields) {
      this.showFields = model.fieldsOrder;
    } // else fields remain user defined

    // tslint:disable-next-line:no-unused-expression
    callBack && callBack();
  }

  toggleEdit() {
    this.editable = !this.edit;
  }

  submit() {
    let orm: any = this.orm;
    function toDate(x) {
      if (x) {
        let d = new Date(x);
        return (d.getTime() + orm.utils.tzOffset) / 1000;
      }
    }
    let lazyFields = Lazy(this.fields);
    let sendFields = Lazy(this.allFields)
      .values()
      .filter((field) => (field.writable && lazyFields.contains(field)) || (field.id in this.values))
      .toArray();
    let sendValues = sendFields.map((field) => {
      let value = this.obj[field.id];
      if (field.widget === 'choices') {
        return value ? value.id : null;
      }
      switch (field.type) {
        case 'date': return toDate(value);
        case 'datetime': return toDate(value);
        case 'boolean': {
          switch (value) {
            case 'F': return 'F';
            case 'T': return 'T';
            case null: return null;
            default: return Boolean(this.obj[field.id]);
          }
        }
        // tslint:disable-next-line:no-switch-case-fall-through
        case 'integer':
          // tslint:disable-next-line:radix
          return parseInt(value);
        case 'floar': return parseFloat(value);
        case 'reference': return value ? value.id : undefined;
        case 'string': {
          if (field.validators.valid) {
            return value ? value.id : null;
          } else {
            return value;
          }
        }
        // tslint:disable-next-line:no-switch-case-fall-through
        default: return this.obj[field.id];
      }
    });
    // reference to original object if any
    let originalObject: any = {};
    if (this.originalObject) {
      originalObject = this.originalObject.asRaw();
    }
    // creating object to send to server
    let sendObject = Lazy(sendFields)
      .pluck('id')
      .zip(sendValues)
      .filter((x) => x[1] !== originalObject[x[0]])
      .toObject();
    // this object may be without id
    if (originalObject.id) {
      sendObject.id = originalObject.id;
    }
    let endPoint = orm.$orm.connection.cachedStatus.endPoint;
    let url = null;
    if (this.model) {
      if (this.verb) {
        url = this.model.modelName + '/' + this.verb;
      } else {
        url = this.model.modelName + '/' + (this.isNew ? 'put' : 'post');
      }
    }
    this.ready = false;
    orm.$sendToEndpoint(url, sendObject).then((id) => {
      if ((id === '') && this.originalObject) {
        id = this.originalObject.id;
      }
      setTimeout((function(){
        this.rwt.get(this.model.modelName, id)
          .then((obj) => {
            this.obj = this.acquireObject(obj);
            this.ready = true;
            try {
              this.cd.markForCheck();
            } catch (e) {}
          });
      }).bind(this), 200);
      this.errors = {};
      this.editable = false;
      this.sent.emit();
    }, (errDef: IRwtValidationError) => {
      this.errors = errDef.errors || {};
      this.ready = true;
    });
  }
};


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
    id: '{{ form.obj[fieldName] }}',
    choices: `{{ value }}<select [required]="required" [(ngModel)]="form.obj[fieldName]">
                  <option [ngValue]="choice" *ngFor="let choice of form.choiceItems[fieldName]">{{ choice }}</option>
              </select>`,
    date: '<input [required]="required" type="date" [(ngModel)]="form.obj[fieldName]">',
    error: '<div class="rwt-error" *ngIf="form.edit && form.errors[fieldName]">{{ form.errors[fieldName] }}</div>',
    // tslint:disable-next-line:max-line-length
    password: '<input [required]="required" [pattern]="pattern" [minlength]="minlength" [maxlength]="maxlength" [(ngModel)]="form.obj[fieldName]" class="form-control" placeholder="{{ field.name }}" type="password">',
  };
  console.log('ciao');
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
