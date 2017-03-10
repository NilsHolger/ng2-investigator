/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AutopilotComponent } from './autopilot.component';

describe('AutopilotComponent', () => {
  let component: AutopilotComponent;
  let fixture: ComponentFixture<AutopilotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutopilotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutopilotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
