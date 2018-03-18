import { Directive, Input, HostListener } from '@angular/core';
import { RwtService } from './rwt.service';

@Directive({
  selector: '[rwtMultiselectable]'
})
export class RwtMultiselectableDirective {
  private obj: any = null;
  private name: string = null;

  constructor(private rwt: RwtService) { }

  @Input() set rwtMultiselectable(value: any) {
    this.name = value.name;
    this.obj = value.bindTo;
  }

  @HostListener('click')
  click(evt: Event) {
    this.rwt.toggleMulti(this.name, this.obj);
  }
}
