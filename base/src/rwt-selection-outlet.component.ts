import { Component, OnInit, Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { RwtService, RwtServed } from './rwt.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'rwt-selection-outlet',
  template: '<ng-content></ng-content>',
  // tslint:disable-next-line:use-input-property-decorator
  inputs: ['resource', 'persistent'],
  // tslint:disable-next-line:use-output-property-decorator
  outputs: ['item'],
})
export class RwtSelectionOutletComponent extends RwtServed implements OnInit {
  public item: any = null;
  public resource: string;
  public persistent: boolean = false;

  constructor(rwt: RwtService) {
    super(rwt);
  }

  ngOnInit() {
    let self = this;
    this.item = this.rwt.getSelectionFor(this.resource);
    this.on('selected-' + this.resource, function(item){
      self.item = item;
    });
    if (this.persistent !== false) {
      this.rwt.makePersistentSelection(this.resource);
    }
  }
}

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[rwtSelectionOutlet]',
  // tslint:disable-next-line:use-input-property-decorator
  inputs: ['persistent'],
  exportAs: 'selected',
})
export class RwtSelectionOutletDirective extends RwtServed implements OnInit {
  public resource: string;
  public _i: any = null;
  public persistent: boolean = false;

  constructor(rwt: RwtService, private template: TemplateRef<any>, private vRef: ViewContainerRef) {
    super(rwt);
  }

  set item(value) {
    this._i = value;
    this.vRef.clear();
    if (value) {
      this.vRef.createEmbeddedView(this.template);
    }
  }

  get item() { return this._i; }

  @Input() set rwtSelectionOutlet (value) {
    this.resource = value.resource;
    this.persistent = value.persistent;
  }

  ngOnInit() {
    let self = this;
    this.item = this.rwt.getSelectionFor(this.resource);
    this.on('selected-' + this.resource, function(item){
      self.item = item;
    });
    if (this.persistent !== false) {
      this.rwt.makePersistentSelection(this.resource);
    }
  }
}
