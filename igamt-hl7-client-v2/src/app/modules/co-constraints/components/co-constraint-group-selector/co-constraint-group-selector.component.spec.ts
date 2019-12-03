import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoConstraintGroupSelectorComponent } from './co-constraint-group-selector.component';

describe('CoConstraintGroupSelectorComponent', () => {
  let component: CoConstraintGroupSelectorComponent;
  let fixture: ComponentFixture<CoConstraintGroupSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoConstraintGroupSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoConstraintGroupSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
