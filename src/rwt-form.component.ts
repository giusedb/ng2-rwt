import { Component, OnInit, OnDestroy, Input, Output, HostListener, ChangeDetectorRef, ComponentFactoryResolver, Type } from '@angular/core';
import { ORM, RwtService } from './rwt.service';

declare var Lazy;

export interface IRwtFormOptions {
  resource?: string;
  record?: number;
  object?: any;
  editable?: boolean;
  title?:string;
  showFields?: Array<string>;
  templateUrl?: string;
}

export class RwtForm implements OnInit{
  public static idx:number = 0;
  public formIdx: number;
  public obj: any;
  protected oldObj: any;

  protected model: any;
  protected modelDef: any;
  protected orm:ORM;
  protected fields: Array<any>;
  public allFields: Array<any>;
  protected edit: boolean = false;
  public title: string = null;
  protected showFields: Array<string>;
  public ready:boolean = false;
  public isNew: boolean = false;

  constructor(protected rwt: RwtService, protected cd: ChangeDetectorRef) {
    this.orm = rwt.orm;
    this.formIdx = RwtForm.idx ++;
  }
  ngOnInit() { }

  public setAttributes(attributes: IRwtFormOptions){ 
    let self = this;
    this.ready = false;
    this.title = attributes.title || null;
    this.showFields = attributes.showFields || null;
    if (attributes.object) {
      this.isNew = false;
      this.gotModel(attributes.object.constructor);
      this.editable = attributes.editable || false;
      this.obj = attributes.object;
      this.ready = true;
      this.cd.detectChanges();
    } else if (attributes.record) {
      let x:any = attributes.record;
      this.isNew = false;
      this.orm.get(attributes.resource, x).then(function(obj){
        attributes.object = obj;
        self.setAttributes(attributes);
      });
    } else if (attributes.resource) {
      this.isNew = true;
      this.orm.getModel(attributes.resource)
        .then(this.gotModel.bind(this))
        .then(function(){
          self.editable = attributes.editable;
          self.ready = true;
          self.cd.detectChanges();
        });
    }
  }

  get editable() { return this.edit }
  set editable(value: boolean) {
    if (value != this.edit) {
      if (value) {
        if (this.isNew) {
          this.oldObj = this.obj = new this.model();
        } else {
          this.oldObj = this.obj;
          this.obj = this.obj.copy();
        }
      } else {
        if (this.isNew) {
          this.obj = new this.model();
        } else {
          this.obj = this.oldObj;
        }
      }
      this.edit = value;
    }
  }

  gotModel(model: any, callBack?:Function){
    this.model = model;
    this.allFields = model.fields;
    let j = Lazy(this.showFields).keys();
    if (this.showFields) {
      this.fields = Lazy(this.allFields).filter((f) => j.contains(f)).toArray();
    } else {
      this.fields = Lazy(model.fieldsOrder).map((f) => this.allFields[f]).toArray();
    }
    callBack && callBack();
  }

  toggleEdit() {
    this.editable = !this.edit;
  }

  submit() {
    this.obj.save().then(function(){
      this.editable = false;
    }.bind(this), function(error){
      alert(error);
    }.bind(this));
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

export function createFeModel(typeTemplates: any): Type<any>{
  let defaultTemplates = {
    integer: '<input [(ngModel)]="form.obj[fieldName]" class="form-control" placeholder="{{ fieldName }}" type="number">',
    float: '<input [(ngModel)]="form.obj[fieldName]" class="form-control" placeholder="{{ fieldName }}" type="number">',
    boolean: '<input [(ngModel)]="form.obj[fieldName]" class="form-control" placeholder="{{ fieldName }}" type="checkbox">',
    text: '<textarea [(ngModel)]="form.obj[fieldName]" class="form-control" placeholder="{{ fieldName }}"></textarea>',
    default: '<input [(ngModel)]="form.obj[fieldName]" class="form-control" placeholder="{{ fieldName }}" type="text">',
    reference: 'reference to: {{ fieldName }}',
    id: '{{ form.obj[fieldName] }}',
  }
  typeTemplates = Lazy(defaultTemplates)
    .keys()
    .concat(Lazy(typeTemplates).keys())
    .unique()
    .map((fieldType:string) => [fieldType, (fieldType in typeTemplates) ? typeTemplates[fieldType] : defaultTemplates[fieldType]])
    .toObject(); 
 
  let fieldTypeTemplates = Lazy(typeTemplates).map((v,k) => '<template ngSwitchCase="' + k + '">' + v + '</template>\n').toString();

  let template = `
      <template ngIf="form.ready">  
        <span *ngIf="form.edit && field.writable">
          <span [ngSwitch]="field.type">
        `
        + fieldTypeTemplates +
        ` <template ngSwitchDefault><input [(ngModel)]="form.obj[fieldName]" class="form-control" placeholder="{{ fieldName }}" type="text"></template>
          </span>
          </span>
        <span *ngIf="!(form.edit && field.writable) && form.obj">
          {{ form.obj[fieldName]}}
        </span>
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

export const RwtFeModelComponent: Type<any> = createFeModel({});
