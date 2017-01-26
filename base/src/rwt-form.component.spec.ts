/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RwtFormComponent } from './rwt-form.component';

describe('RwtFormComponent', () => {
  let component: RwtFormComponent;
  let fixture: ComponentFixture<RwtFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RwtFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RwtFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
