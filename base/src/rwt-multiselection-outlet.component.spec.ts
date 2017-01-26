/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RwtMultiselectionOutletComponent } from './rwt-multiselection-outlet.component';

describe('RwtMultiselectionOutletComponent', () => {
  let component: RwtMultiselectionOutletComponent;
  let fixture: ComponentFixture<RwtMultiselectionOutletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RwtMultiselectionOutletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RwtMultiselectionOutletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
