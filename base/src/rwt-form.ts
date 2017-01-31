import { Component, OnInit, OnDestroy, Input, Output, HostListener, ChangeDetectorRef, ComponentFactoryResolver, Type, EventEmitter, ViewChild, ViewChildDecorator, ElementRef } from '@angular/core';
import { ORM, RwtService, RwtServed, IRwtField,  Fields, IRwtValidationError } from './rwt.service';

declare let Lazy;

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

export class RwtForm extends RwtServed {
  public obj: any;
  protected oldObj: any;
  protected values: any;
  protected choiceItems: any = {}; // { field name : }
  protected model: any;
  protected modelDef: any;
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
  private config: IRwtFormOptions;

  constructor(rwt: RwtService, protected cd: ChangeDetectorRef) {
    super(rwt);
  }

  /**
   * called when model is fetched
   */
  private gotModel(model: any) {
    // setting base
    this.model = model;
    this.defineFields();
  }

  /**
   * Define fields to show user
   */
  private defineFields() {
    // setting commons
    if (!this.showFields) {
      this.showFields = this.model.fieldsOrder;
    }

    // searching for extra fields
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
            field.name = fieldName.split(' ').map(this.rwt.orm.utils.capitalize).join(' ');
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
    // fetching object
    if (this.config.object) {
      this.gotObject(this.config.object);
    } else if (this.config.record) {
      this.rwt.get(this.model.modelName, this.config.record).then(this.gotObject.bind(this));
    }
  }

  /**
   * Define object to be represented to user and save originals
   */
  private gotObject(obj) {
    if (obj) {
      this.originalObject = obj;
      this.obj = obj.asRaw();
    }
    // adjusting data and references according to Python server
    // date and datetime
    for (let field of this.fields.filter(field => ((field.type === 'date') || (field.type === 'datetime')))) {
      if (typeof this.obj[field.id] === 'number') {
        this.obj[field.id] = new Date(this.obj[field.id]);
      }
    }
    // references
    for (let field of this.fields.filter(field => ((field.type === 'reference')))) {
      if (typeof this.obj[field.id] === 'number') {
        this.obj[field.id] = new Date(this.obj[field.id]);
      }
    }
  }

  /**
   * Initialize form with all attributea once
   */
  public setAttributes(attributes: IRwtFormOptions) {
    // setting initial values
    this.config = attributes;
    this.ready = false;
    this.title = attributes.title || null;
    this.showFields = attributes.showFields || null;
    this.extraFields = attributes.fieldDefs || null;
    this.values = attributes.values || {};
    this.verb = this.verb || null;
    this.errors = {};
    if (attributes.object) {
        this.gotModel(attributes.object.constructor);
    } else if (attributes.resource) {
        this.rwt.orm.getModel(attributes.resource).then(this.gotModel.bind(this));
    }
  }
}
