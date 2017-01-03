import { Component, OnInit } from '@angular/core';
import { RwtService } from './rwt.service';

@Component({
  selector: 'rwt-selection-outlet',
  template: '<ng-content></ng-content>',
  inputs: ['resource','persistent'],
  outputs: ['item'],
})
export class RwtSelectionOutletComponent implements OnInit {
  public item: any=null;
  public resource: string;
  private eSelection: number;
  public persistent: boolean = false;

  constructor(private rwt: RwtService) {  }
  
  ngOnInit() {
    let self = this;
    this.item = this.rwt.getSelectionFor(this.resource);
    this.eSelection = this.rwt.on('selected-' + this.resource, function(item){
      self.item = item;
    });
    if (this.persistent !== false) {
      this.rwt.makePersistentSelection(this.resource);
    }
  }

  ngOnDestroy() {
    this.rwt.unbind(this.eSelection);
  }
}
