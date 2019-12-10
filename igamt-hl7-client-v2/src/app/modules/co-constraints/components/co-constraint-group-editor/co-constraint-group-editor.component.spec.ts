import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoConstraintGroupEditorComponent } from './co-constraint-group-editor.component';

describe('CoConstraintGroupEditorComponent', () => {
  let component: CoConstraintGroupEditorComponent;
  let fixture: ComponentFixture<CoConstraintGroupEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoConstraintGroupEditorComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoConstraintGroupEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
