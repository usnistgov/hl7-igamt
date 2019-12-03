import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoConstraintBindingDialogComponent } from './co-constraint-binding-dialog.component';

describe('CoConstraintBindingDialogComponent', () => {
  let component: CoConstraintBindingDialogComponent;
  let fixture: ComponentFixture<CoConstraintBindingDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoConstraintBindingDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoConstraintBindingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
