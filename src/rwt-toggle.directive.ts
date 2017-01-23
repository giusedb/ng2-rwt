import { Directive, ChangeDetectorRef, Input, HostListener } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[rwtToggle]',
})
export class RwtToggleDirective {
  private attrName: string;
  public obj: any;

  constructor(private cd: ChangeDetectorRef) {  }

  @Input() set rwtToggle (value){
    this.attrName = value.attribute;
    this.obj = value.bindTo;
  }

  @HostListener('click')
  click() {
    this.obj[this.attrName] = ! this.obj[this.attrName];
    return false;
  }
}

@Directive({
  selector: '[rwtSet]'
})
export class RwtSetDirective {
  private attrName: string;
  public obj: any;
  public value: any;

  constructor(private cd: ChangeDetectorRef) {  }

  @Input() set rwtSet (value: any){
    this.attrName = value.attribute;
    this.obj = value.bindTo;
    this.value = value.value;
  }

  @HostListener('click')
  click() {
    this.obj[this.attrName] = this.value;
    return false;
  }
}
