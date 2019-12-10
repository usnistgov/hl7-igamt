import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SegmentCoConstraintBindingComponent } from './segment-co-constraint-binding.component';

describe('SegmentCoConstraintBindingComponent', () => {
  let component: SegmentCoConstraintBindingComponent;
  let fixture: ComponentFixture<SegmentCoConstraintBindingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SegmentCoConstraintBindingComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SegmentCoConstraintBindingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
