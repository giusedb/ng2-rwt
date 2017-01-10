import { Component, OnInit } from '@angular/core';
import { RwtService, RwtServed } from './rwt.service';

@Component({
  selector: 'rwt-selection-outlet',
  template: '<template [ngIf]="item"><ng-content></ng-content></template>',
  inputs: ['resource','persistent'],
  outputs: ['item'],
})
export class RwtSelectionOutletComponent extends RwtServed implements OnInit {
  public item: any=null;
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
