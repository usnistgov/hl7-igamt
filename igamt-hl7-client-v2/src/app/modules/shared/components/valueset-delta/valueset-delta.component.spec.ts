import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValuesetDeltaComponent } from './valueset-delta.component';

describe('ValuesetDeltaComponent', () => {
  let component: ValuesetDeltaComponent;
  let fixture: ComponentFixture<ValuesetDeltaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValuesetDeltaComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValuesetDeltaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
