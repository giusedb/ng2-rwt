import { Directive, ChangeDetectorRef, Input, HostListener } from '@angular/core';

@Directive({
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
    console.log('click');
    this.obj[this.attrName] =! this.obj[this.attrName];
    return false; 
  }
}
