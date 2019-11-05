import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoConstraintTableComponent } from './co-constraint-table.component';

describe('CoConstraintTableComponent', () => {
  let component: CoConstraintTableComponent;
  let fixture: ComponentFixture<CoConstraintTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoConstraintTableComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoConstraintTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
