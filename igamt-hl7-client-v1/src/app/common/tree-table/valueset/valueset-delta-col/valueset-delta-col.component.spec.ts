import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValuesetDeltaColComponent } from './valueset-delta-col.component';

describe('ValuesetDeltaColComponent', () => {
  let component: ValuesetDeltaColComponent;
  let fixture: ComponentFixture<ValuesetDeltaColComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValuesetDeltaColComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValuesetDeltaColComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
