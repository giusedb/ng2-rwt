import { Directive, Input, ElementRef, OnDestroy, HostListener } from '@angular/core';
import { RwtService } from './rwt.service';

export interface IRwtSelectableData {
  bindTo: any;
}

@Directive({
  selector: '[rwtSelectable]'
})
export class RwtSelectableDirective implements OnDestroy {
  protected ref: any;
  protected selected: boolean;
  protected eSelection: number;
  protected eUnSelection: number;

  constructor(private rwt: RwtService, private er: ElementRef) {
    let self = this;
  }

  @Input() set rwtSelectable  (value: any) {
    let self = this;
    this.ref = value;
    if (this.eSelection){
      this.rwt.unbind(this.eSelection);
    }
    if (this.eUnSelection) { this.rwt.unbind(this.eSelection) }
    this.eUnSelection = this.rwt.on('unselected-' + this.ref.constructor.modelName, function(ref){
      if ((ref == self.ref) && self.ref.$selected) { 
        self.ref.$selected = false;
        self.er.nativeElement.classList.remove('rwt-selected');
      }
    })
    this.eSelection = this.rwt.on('selected-' + this.ref.constructor.modelName, function(ref){
      if ((ref == self.ref) && !self.ref.$selected) {
        self.ref.$selected = true;
        self.er.nativeElement.classList.add('rwt-selected');
      }
    });
  }

  ngOnDestroy() {
    this.rwt.unbind(this.eSelection)
  }

  @HostListener('click')
  click() {
    this.rwt.select(this.ref);
    return false;
  }
}
