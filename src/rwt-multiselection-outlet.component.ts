import { Component, OnInit, Input } from '@angular/core';
import { RwtService } from './rwt.service';

declare var Lazy;

export interface IRwtMultiSelectable {
  name: string;
  sortBy?: string;
  sortDirection?: string;
}

@Component({
  selector: '[rwtMultiselectionOutlet]',
  template: '<ng-content></ng-content>',
  outputs: ['selected'],
})
export class RwtMultiselectionOutletComponent implements OnInit {
  public selected: Array<any>;
  public name: string;
  public sortOrder: string;
  public sortDirection: boolean;
  public eSelected: number;

  constructor(protected rwt: RwtService) { }

  ngOnInit() {
    this.selected = this.rwt.getMultiSelection(this.name)
  }

  @Input() set rwtMultiselectionOutlet (value: IRwtMultiSelectable) {
    let self = this;
    this.name = value.name;
    this.sortOrder = value.sortBy;
    this.sortDirection = value.sortDirection == 'asc';
    if (this.eSelected) { this.rwt.unbind(this.eSelected)}
    this.eSelected = this.rwt.on('update-multiselection-' + this.name, function(selection) {
      if (self.sortOrder) {
        self.selected = Lazy(selection).sortBy(self.sortOrder).toArray();
      } else {
        self.selected = selection;
      }
    })
  }
}
