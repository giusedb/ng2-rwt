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
};

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
};

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

  // tslint:disable-next-line:member-ordering
  @Output() sent = new EventEmitter();

  // maybe useless
  @ViewChild('mainForm') protected mainForm: ElementRef;

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
    this.allFields = Lazy(this.model.fields).toObject();
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
      // my object is on config
      this.gotObject(this.config.object);
    } else if (this.config.record) {
      // I can fetch object from ID
      this.rwt.get(this.model.modelName, this.config.record).then(this.gotObject.bind(this));
    } else {
      // object is new
      this.isNew = true;
      this.gotObject(new this.model());
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
        this.obj[field.id] = new Date(this.obj[field.id] * 1000);
      }
    }
    // predeterminated values
    Lazy(this.values).each((value, fieldName:string) => {
      this.obj[fieldName] = value;
    });
    if (this.config.editable) {
      this.fetchAlternatives();
    } else {
      this.resolveReferences();
    }
  }


  /**
   * Resolve all selectable references with selectable choices
   */
  private fetchAlternatives() {
    let references = this.fields.filter(field => field.type === 'reference');
    let refLen = references.length;
    references.forEach(field => {
      // fetch choosable alternatives for reference choice
      this.rwt.get(field.to)
        .then(objects => {
          this.choiceItems[field.id] = objects;
          refLen --;
          if (refLen === 0) {
            // all references fetched
            this.resolveReferences();
          }
        })
    });
    if (refLen === 0) {
      this.finalize();
    }
  }

  /**
   * Resolve all reference for object if not yet resolved
   * 
   */
  private resolveReferences() {
    let references = this.fields.filter(field => field.type === 'reference');
    let refLen = references.length;
    
    // resolving references
    references.forEach(field => {
      if (typeof this.obj[field.id] === 'number') {
        this.rwt.get(field.to, this.obj[field.id])
          .then(val => {
            this.obj[field.id] = val;
            refLen--;
            if (refLen === 0) {
              // resolved all references
              this.finalize();
            }
          });
      } else {
        refLen --;
      }
    });

    if (refLen === 0) {
      this.finalize();
    }
  }

  /**
   * Resolve not reference choices and finalize all form creation
   */
  private finalize() {
    // resolving choices
    Lazy(this.fields).filter((field: IRwtField) => (field.widget === 'choices') && (field.type !== 'reference'))
      .each((field: IRwtField) => {
        let value = this.obj[field.id];
        for (let item of this.choiceItems[field.id]) {
          if (item.id == value) {
            this.obj[field.id] = item;
            break;
          }
        }
      });
    // setting editable
    this.editable = this.config.editable;
    // got ready
    this.ready = true;
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

  public get editable() { return this.edit; }
  public set editable(value: boolean) {
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
          this.rwt.orm.get(<any>field.to, this.fieldFilters[field.id] || {})
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
  /**
   * Toggle editable attribute
   */
  toggleEdit() {
    this.editable = !this.edit;
  }


  /**
   * Format object for RWT protocol and send it to server via net
   * If it succed
   */
  submit() {
    let orm: any = this.rwt.orm;
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
      } else {
        // create eventhandler
        let eventHandler = this.on('updated-' + this.model.modelName, items => {
          for (let item of items) {
            if (item.id === id) {
              // refreshing original object
              this.rwt.get(this.model.modelName).then(this.gotObject.bind(this));

              // remove event handler
              this.rwt.unbind(eventHandler);
            }
          }
        });
        // wait for result
        /*
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
        */
      }
      this.errors = {};
      this.editable = false;
      this.sent.emit();
    }, (errDef: IRwtValidationError) => {
      this.errors = errDef.errors || {};
      this.ready = true;
    });
  }
};

