import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValueSetCrossRefsComponent } from './value-set-cross-refs.component';

describe('ValueSetCrossRefsComponent', () => {
  let component: ValueSetCrossRefsComponent;
  let fixture: ComponentFixture<ValueSetCrossRefsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValueSetCrossRefsComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValueSetCrossRefsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
