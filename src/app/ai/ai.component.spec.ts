/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AiComponent } from './ai.component';

describe('AiComponent', () => {
  let component: AiComponent;
  let fixture: ComponentFixture<AiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
