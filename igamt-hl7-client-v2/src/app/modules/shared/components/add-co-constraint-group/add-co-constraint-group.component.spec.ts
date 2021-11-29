import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCoConstraintGroupComponent } from './add-co-constraint-group.component';

describe('AddCoConstraintGroupComponent', () => {
  let component: AddCoConstraintGroupComponent;
  let fixture: ComponentFixture<AddCoConstraintGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCoConstraintGroupComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCoConstraintGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
