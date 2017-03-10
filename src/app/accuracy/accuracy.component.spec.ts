/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AccuracyComponent } from './accuracy.component';

describe('AccuracyComponent', () => {
  let component: AccuracyComponent;
  let fixture: ComponentFixture<AccuracyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccuracyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccuracyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
