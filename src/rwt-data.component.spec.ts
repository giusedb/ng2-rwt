/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RwtDataComponent } from './rwt-data.component';

describe('RwtDataComponent', () => {
  let component: RwtDataComponent;
  let fixture: ComponentFixture<RwtDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RwtDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RwtDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
