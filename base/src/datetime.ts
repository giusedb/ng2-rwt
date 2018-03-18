import { Component, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'rwt-datetime',
  template: '<input type="datetime-local" [value]="inValue" (change)="onChange($event)" [required]="required">',
  inputs: ['model'],
  outputs: ['model', 'change'],
})
class DatetimeComponent implements OnInit {
  outVal: Date;
  inValue: string;
  change: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  set model (value: any) {
    if (typeof value === 'string') {
        this.inValue = value;
        try {
            this.outVal = new Date(value);
        } catch (e) { }
    } else if (value && value.constructor === Date) {
        this.inValue = value.toJSON().slice(0, 16);
        this.outVal = value;
    }
  }
  get model() {
    return this.outVal;
  }

  onChange(evt) {
    let val = evt.target.value;
    if (val) {
        this.model = val;
    } else {
        this.model = null;
    }
    evt.target.value = this.inValue;
    this.change.emit(evt);
  }

}
