import { Directive, Input, ElementRef, OnDestroy, HostListener } from '@angular/core';
import { RwtService, RwtServed } from './rwt.service';

export interface IRwtSelectableData {
  bindTo: any;
}

@Directive({
  selector: '[rwtSelectable]'
})
export class RwtSelectableDirective extends RwtServed {
  protected ref: any;
  protected selected: boolean;

  constructor(rwt: RwtService, private er: ElementRef) {
    super(rwt);
    let self = this;
  }

  @Input() set rwtSelectable  (value: any) {
    let self = this;
    this.ref = value;
    this.ngOnDestroy()
    this.on('unselected-' + this.ref.constructor.modelName, function(ref){
      if ((ref == self.ref) && self.ref.$selected) { 
        self.ref.$selected = false;
        self.er.nativeElement.classList.remove('rwt-selected');
      }
    })
    this.on('selected-' + this.ref.constructor.modelName, function(ref){
      if ((ref == self.ref) && !self.ref.$selected) {
        self.ref.$selected = true;
        self.er.nativeElement.classList.add('rwt-selected');
      }
    });
  }

  @HostListener('click')
  click() {
    this.rwt.select(this.ref);
    return false;
  }
}
