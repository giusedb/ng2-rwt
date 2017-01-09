import { Component, OnInit, OnDestroy, Input, Output, HostListener, ChangeDetectorRef, ComponentFactoryResolver, Type } from '@angular/core';
import { ORM, RwtService, IRwtField,  Fields} from './rwt.service';

declare var Lazy;

export class Choice {
  public id:any;
  private text: string;
  constructor(element: any) {
    if (element && element.isPrototypeOf(Array)){
      this.id = element[0];
      this.text = (element.length === 0)?this.id:element[1];
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
  title?:string;
  showFields?: Array<string>;
  fieldDefs?: Fields;
  values?: any;
  extraFields?: Fields;
  fields?: Array<IRwtField>;
  verb?:string;
}

export class RwtForm implements OnInit{
  public static idx:number = 0;
  public formIdx: number;
  public obj: any;
  protected oldObj: any;
  protected values: any;
  protected choiceItems: any = {}; // { field name : }

  protected model: any;
  protected modelDef: any;
  protected orm:ORM;
  protected fields: Array<IRwtField>;
  protected fieldFilters: any = {};
  public allFields: Array<any>;
  protected edit: boolean = false;
  public title: string = null;
  protected showFields: Array<string>;
  public ready:boolean = false;
  public isNew: boolean = false;
  public extraFields: Fields;
  public errors:any = {};
  protected verb: string;
  private transFieldFunction:any = {};
  

  constructor(protected rwt: RwtService, protected cd: ChangeDetectorRef) {
    this.orm = rwt.orm;
    this.formIdx = RwtForm.idx ++;
  }
  ngOnInit() { }

  private updateObject(){
    if (this.values) {
      // update each object key
      Lazy(this.values).each((v,k)=> {
        this.obj[k] = v;
      });
    }
  }

  private acquireObject(obj){
    if (obj){
      return Lazy(obj.constructor.fields)
        .map((field, fieldName) => {
          let v = obj[fieldName];
          if (field.type === 'reference'){
//            v = obj['_' + fieldName]
          }
          return [fieldName, v];
        }).toObject();
    }
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
          if (!("id" in field)){
            field.id = fieldName;
          }
          // setting name as capitalized field name
          if (!("name" in field)){
            field.name = fieldName.split(' ').map(this.orm.utils.capitalize).join(' ');
          }
          if (!("type" in field)){
            field.widget = "string";
            field.type = "string";
          }
          if (!("writable" in field) && !("readable" in field)){
            field.writable = true;
          }
      });

      // deep merge for each field
      Lazy(this.extraFields).each((v,k) => {
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
        if (field.widget == field.type){
          field.widget = 'choices';
        }
        this.choiceItems[field.id] = Lazy(field.validators.valid)
          .map((x) => new Choice(x[0],x[1])).toArray();
      }
    });
  }

  private finalize(editable:boolean) {
    /**
     * Finalizes object and field creation
     */
    this.ready = true;
    this.updateFields();
    this.updateObject();
    this.editable = editable || false;
    this.cd.detectChanges();    
  }

  public setAttributes(attributes: IRwtFormOptions){ 
    /**
     * Redefine all attributes for form rendering
     */
    let self = this;
    this.ready = false;
    this.title = attributes.title || null;
    this.showFields = attributes.showFields || null;
    this.extraFields = attributes.fieldDefs || null;
    this.values = attributes.values || null;
    this.verb = this.verb || null;
    if (attributes.fields){
      this.gotModel({
        fields : Lazy(attributes.fields).indexBy('id').toObject(),
        fieldsOrder: Lazy(attributes.fields).pluck('id').toArray(),
      });
      this.finalize(attributes.editable);
    } else {
      if (attributes.object) {
        this.isNew = false;
        this.gotModel(attributes.object.constructor);
        this.obj = this.acquireObject(attributes.object);
        this.finalize(attributes.editable);
      } else if (attributes.record) {
        let x:any = attributes.record;
        this.isNew = false;
        this.orm.get(attributes.resource, x).then(function(obj){
          if (obj){
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
  }

  get editable() { return this.edit }
  set editable(value: boolean) {
    if (value != this.edit) {
      let numChoiches = Lazy(this.fields)
        .filter((field) => (
          ((field.type === 'reference') 
          || field.validators.valid) 
          && (field.writable)))
        .size()
      // fetching choiches for references
      for (let field of this.fields){
        if ((field.type === 'reference') && (field.writable)){
          this.orm.query(<any>field.to, this.fieldFilters[field.id] || {})
            .then((references) => {
              this.choiceItems[field.id] = references;
              numChoiches --;
              if (numChoiches === 0){
                this.cd.detectChanges();
              }
            })
        }
      }
      
      
      /*
      if (value) {
        if (this.isNew) {
          this.oldObj = this.obj = (new this.model()).asRaw();
        } else {
          this.oldObj = this.obj;
        }
      } else {
        if (this.isNew) {
          this.obj = (new this.model()).copy();
        } else {
          this.obj = this.oldObj;
        }
      }
      */
      this.edit = value;
    }
  }

  gotModel(model: any, callBack?:Function){
    this.model = model;
    // copy original model fields
    this.allFields = Lazy(model.fields).toObject();
    if (!this.showFields){
      this.showFields = model.fieldsOrder;
    } // else fields remain user defined

    callBack && callBack();
  }

  toggleEdit() {
    this.editable = !this.edit;
  }

  submit() {
    let orm: any = this.orm;
    function toDate(x) {
      if (x){
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
      if (field.widget === 'choices'){
        return value?value.id:null;
      }
      switch (field.type){
        case 'date': return toDate(value);
        case 'datetime': return toDate(value);;
        case 'boolean': { 
          switch (value) {
            case 'F': return 'F';
            case 'T': return 'T';
            case null: return null;
            default: return Boolean(this.obj[field.id])  
          }
        };
        case 'integer': return parseInt(value);
        case 'floar': return parseFloat(value);
        case 'reference': return value?value.id:undefined;
        case 'string': {
          if (field.validators.valid){ return value?value.id:null; }
          else return value;
        }
        default: return this.obj[field.id];
      }
    });
    let sendObject = Lazy(sendFields)
      .pluck('id')
      .zip(sendValues)
      .filter((x) => x[1] !== undefined)
      .toObject();
    let endPoint = orm.$orm.connection.options.endPoint;
    let url = null;
    if (this.model) {
      if (this.verb) {
        url = this.model.modelName + '/' + this.verb;
      } else {
        url = this.model.modelName + '/' + (this.isNew?'put':'post');
      }
    }
    orm.$sendToEndpoint(url,sendObject).then((xhr) => {
      this.errors = {};
      this.editable = false;
    },(xhr) => {
      if (xhr.request.status === 513){
        this.errors = xhr.responseData.errors;
      }
    })
  }
};


@Component({
  selector: '[rwtFormInline]',
  template: `
  <form novalidate (submit)="submit()">
    {{ title }}
    <ng-content></ng-content>
  </form>`,
})
export class RwtFormInlineComponent extends RwtForm {
  constructor(rwt : RwtService, cd: ChangeDetectorRef) {
    super(rwt, cd);
  }
  @Input() set rwtFormInline (value: IRwtFormOptions) {
    super.setAttributes(value);
  }
}

@Component({
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

@Component({
  selector: '[rwtTableForm]',
  template: `
      <tr *ngIf="title">
        <th colspan="2">
          {{ title }}
        </th>
      </tr>
      <tr *ngFor="let field of fields">
        <td><label for="{{ field.id }}"><b>{{ field.name }}</b></label></td>
        <td [rwtFeModel]="field.id" [form]="this"></td>
      </tr> 
  `,
})
export class RwtTableFormComponent extends RwtForm {
  constructor(rwt : RwtService, cd: ChangeDetectorRef) {
    super(rwt, cd);
  }

  @Input() set rwtTableForm(value: IRwtFormOptions) {
    super.setAttributes(value);
  }
}


export function createFeModel(editableTemplates: any, staticTemplates: any): Type<any>{
  let defaultTemplates = {
    integer: '<input [(ngModel)]="form.obj[fieldName]" class="form-control" placeholder="{{ fieldName }}" type="number">',
    float: '<input [(ngModel)]="form.obj[fieldName]" class="form-control" placeholder="{{ fieldName }}" type="number">',
    boolean: '<input [(ngModel)]="form.obj[fieldName]" class="form-control" placeholder="{{ fieldName }}" type="checkbox">',
    text: '<textarea [(ngModel)]="form.obj[fieldName]" class="form-control" placeholder="{{ fieldName }}"></textarea>',
    default: '<input [(ngModel)]="form.obj[fieldName]" class="form-control" placeholder="{{ fieldName }}" type="text">',
    choices: `<select [(ngModel)]="form.obj[fieldName]">
                  <option [value]="choice" *ngFor="let choice of form.choiceItems[fieldName]">{{ choice }}</option>
              </select>`,
    date: '<input type="date" [(ngModel)]="form.obj[fieldName]">',    
    id: '{{ form.obj[fieldName] }}',
    error: '<div class="rwt-error" *ngIf="form.errors[fieldName]">{{ form.errors[fieldName] }}</div>',
  } 
  let typeTemplates = Lazy(defaultTemplates)
    .keys()
    .concat(Lazy(editableTemplates).keys())
    .unique()
    .map((fieldType:string) => [fieldType, (fieldType in editableTemplates) ? editableTemplates[fieldType] : defaultTemplates[fieldType]])
    .toObject(); 

  let errorTemplate:string = typeTemplates.error;  
  delete typeTemplates.error;
  let fieldTypeTemplates = Lazy(typeTemplates).map((v,k) => '<template ngSwitchCase="' + k + '">' + v + '</template>\n').toString();

  let template = `
      <template [ngIf]="form.ready">
        <template [ngIf]="form.edit && field.writable">
          <span [ngSwitch]="field.widget">
        `
        + fieldTypeTemplates +
        ` <template ngSwitchDefault><input [(ngModel)]="form.obj[fieldName]" class="form-control" placeholder="{{ fieldName }}" type="text"></template>
          </span>
        </template>
        <template [ngIf]="!(form.edit && field.writable) && form.obj">{{ form.obj[fieldName]}}</template>
        <template [ngIf]="form.errors[fieldName]">` + errorTemplate + `</template>
      </template>
    `
  @Component({
    selector: '[rwtFeModel]',
    inputs: ['form'],
    template: template, 
  })
  class RwtFeModel implements OnInit {
    public form: RwtForm;
    public field:any;
    public fieldName: string;

    @Input() set rwtFeModel (value: string) {
      this.fieldName = value;
      this.field = this.form.allFields[value];
    }

    ngOnInit() {

    }
  }
  return RwtFeModel
}
var types = {}
try {
  types = require('type-widgets.js').types;
  console.info('found cusrom field types for ' + Lazy(types).keys().toArray().join(', '));
} catch (e) {
  console.warn('field-types.js is not found', e);
}
export const RwtFeModelComponent: Type<any> = createFeModel(types);
