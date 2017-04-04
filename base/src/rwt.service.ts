import { Injectable, ApplicationRef, Optional, OnDestroy, ViewContainerRef } from '@angular/core';
import { RwtModuleConfig } from './shared';
import { ORM } from './interfaces';

declare let rwt;
declare var Lazy;
declare var window;

if (!window) {
  // tslint:disable-next-line:no-shadowed-variable
  let window = this;
}


@Injectable()
export class RwtService {
  public orm: ORM;
  private initialized: boolean;
  private singleSelections: Object = {};
  private multiSelections: Object = {};
//  public on: Function;
  public get: Function;
  public emit: Function;
//  public query: Function;
  public addModelHandler: Function;
  public unbind: Function;
  public persistentSelections: any= {};
  public ready = false;
  private waitingEvents: any[] = [];

  constructor(private app: ApplicationRef) { }

  /**
   * Connect Rwt with its base end point
   */
  public connect(endPoint: string) {
    let orm: ORM = this.orm = new rwt(endPoint);
    window.orm = orm;
    orm.on('got-data', () => {
      this.app.tick();
    });
    this.on = orm.on.bind(orm);
    this.get = orm.get.bind(orm);
//    this.query = orm.query.bind(orm);
    this.emit = orm.emit.bind(orm);
    this.unbind = orm.unbind.bind(orm);
    orm.unbind((<any>orm).$orm.validationEvent);
    this.waitingEvents.forEach(event => {
      this.on.apply(undefined, event);
    });
  }

  on(eventName: string, handler: Function):number  {
    this.waitingEvents.push([eventName, handler]);
    return 0;
  }

  public select(obj: any) {
    let resource = obj.constructor.modelName;
    if (this.singleSelections[resource]) { this.emit('unselected-' + resource, this.singleSelections[resource]); }
    this.singleSelections[resource] = obj;
    this.emit('selected-' + resource, obj);
    if (resource in this.persistentSelections) {
      this.savePersistent(resource, obj.id);
    }
    this.app.tick();
  }

  private savePersistent(resource: string, value: number) {
    localStorage['pS:' + resource] = value;
  }

  public makePersistentSelection(resource: string) {
    this.persistentSelections[resource] = true;
  }

  public getSelectionFor(resource: string ): any {
    if (resource in this.singleSelections) {
      return this.singleSelections[resource];
    }
    let key: string = 'pS:' + resource;
    if (key in localStorage) {
      let self = this;
      // tslint:disable-next-line:radix
      let ids: any = parseInt(localStorage[key]);
      this.orm.get(resource, ids).then(function(item: any){
        if (item) {
          self.select(item);
        }
      });
    }
    return null;
  }

  public toggleMulti(name: string, obj: any) {
    if (!(name in this.multiSelections)) {
      this.multiSelections[name] = {};
    }
    if (obj.id in this.multiSelections[name]) {
      delete this.multiSelections[name][obj.id];
      obj.$multiselected = false;
    } else {
      this.multiSelections[name][obj.id] = obj;
      obj.$multiselected = true;
    }
    this.emit('update-multiselection-' + name, this.getMultiSelection(name));
  }


  public selectMulti(name: string, obj: any) {
    if (!(name in this.multiSelections)) {
      this.multiSelections[name] = {};
    }
    this.multiSelections[name][obj.id] = obj;
    obj.$multiselected = true;
    this.emit('update-multiselection-' + name, this.getMultiSelection(name));
  }

  public unSelectMulti(name: string, obj: any) {
    if (!(name in this.multiSelections)) {
      this.multiSelections[name] = {};
    }
    if (obj.id in this.multiSelections[name]) {
      delete this.multiSelections[name][obj.id];
      obj.$multiselected = false;
    }
    this.emit('update-multiselection-' + name, this.getMultiSelection(name));
  }

  public getMultiSelection(name: string): Array<any> {
    return Lazy(this.multiSelections[name]).values().toArray();
  }
}

export class RwtServed  implements OnDestroy {
  protected eventHandlers: number[] = [];
  protected waiting: boolean = false;
  public orm: ORM;
  // tslint:disable-next-line:no-shadowed-variable
  constructor(protected rwt: RwtService) { 
    this.orm = rwt.orm;
  }

  protected on (eventName: string, eventHandler: Function): number {
    let evt = this.rwt.on(eventName, eventHandler);
    this.eventHandlers.push(evt);
    return evt;
  }

  ngOnDestroy() {
    this.eventHandlers.forEach(<any>this.rwt.unbind);
  }
}
