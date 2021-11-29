import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoConstraintGroupDeltaEditorComponent } from './co-constraint-group-delta-editor.component';

describe('CoConstraintGroupDeltaEditorComponent', () => {
  let component: CoConstraintGroupDeltaEditorComponent;
  let fixture: ComponentFixture<CoConstraintGroupDeltaEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoConstraintGroupDeltaEditorComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoConstraintGroupDeltaEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
