import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextCoConstraintBindingComponent } from './context-co-constraint-binding.component';

describe('ContextCoConstraintBindingComponent', () => {
  let component: ContextCoConstraintBindingComponent;
  let fixture: ComponentFixture<ContextCoConstraintBindingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContextCoConstraintBindingComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextCoConstraintBindingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
