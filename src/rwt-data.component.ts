import { Component, OnInit, ApplicationRef, ElementRef, Input, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ORM, RwtService, IModel } from './rwt.service';

declare var Lazy;

export interface IRwtAttributes {
  resource: string;
  filter: Object;
  persistentAttributes: Array<string>;
}


@Component({
  // tslint:disable-next-line:component-selector
  selector: '[rwtData]',
  template: '<ng-content></ng-content>',
  exportAs: 'rwt-data',
})

export class RwtDataComponent implements OnInit, OnDestroy {
  protected resource: string;
  protected filter: Object;
  protected filterFunction: Function;
  protected items: Array<any>;
  protected orm: ORM;
  protected app: ApplicationRef;
  protected persistentAttributes: Array<string> = [];
  protected el: ElementRef;
  protected gotDataEventHandler: number;
  protected updateFilterHandler: number;
  protected newFilterHandler: number;
  protected deleteFilterHandler: number;
  public select: Function;

  /**
   * Fetches needed dat from server
   */
  fetch(): void {
    let ths = this;
    this.orm.query(this.resource, this.filter).then(function(items){
      ths.items = items;
    });
  }
  /**
   * Called when items are updated
   * It understand if items are showables or not and remove or add items to this view
   */
  protected onUpdateItems(items: Array<any>) {
    console.log('update:', items);
  }

  /**
   * Called when new items marked as deleted
   * It delete items
   */
  onDeleteItems(items: Array<number>) {
    console.log('delete', items);
    let itms = Lazy(items);
    this.items = this.items.filter((x) => !itms.contains(x.id));
  }

  /**
   * Called when new items are fetched from client
   * It adds items to the view according with filters
   */
  onNewItems(items: any) {
    console.log('new', items);
    // adding all items who pass filter selection
    Array.prototype.push.apply(this.items, items.filter(this.filterFunction).toArray());
  }

 constructor(rwt: RwtService, cd: ChangeDetectorRef) {
    this.items = [];
    this.orm = rwt.orm;
    this.select = rwt.select.bind(rwt);
    this.gotDataEventHandler = this.orm.on('got-data', function(){
      cd.detectChanges();
    });
  }

  /**
   * main initialize funcion
   */
  @Input() set rwtData(value: IRwtAttributes) {
    console.log(value);
    if ('resource' in value) {
      this.resource = value['resource'];
      if (value['filter']) {
        this.filter = value['filter'];
      } else {
        this.filter = {};
      }
      if ('persistentAttributes' in value) {
        this.orm.addPersistentAttributes(value.resource, value.persistentAttributes);
      }
      this.fetch();
    }
    if (value.filter) {
      this.orm.getModel(this.resource).then(function(model){
        this.filterFunction = this.orm.utils.makeFilter(model, this.filter);
      }.bind(this));
    } else {
      this.filterFunction = Boolean;
    }
    // if I have a filter i have to unregister it from eventMangers
    if (this.updateFilterHandler) { this.orm.unbind(this.updateFilterHandler )}
    if (this.deleteFilterHandler) { this.orm.unbind(this.deleteFilterHandler )}
    if (this.newFilterHandler) { this.orm.unbind(this.newFilterHandler )}

    // and then relink it to new function
    this.newFilterHandler = this.orm.on('new-' + this.resource, this.onNewItems.bind(this));
    this.updateFilterHandler = this.orm.on('updated-' + this.resource, this.onUpdateItems.bind(this));
    this.deleteFilterHandler = this.orm.on('deleted-' + this.resource, this.onDeleteItems.bind(this));
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.orm.unbind(this.gotDataEventHandler);
  }

}
