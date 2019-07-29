import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoconstraintsEditorComponent } from './coconstraints-editor.component';

describe('CoconstraintsEditorComponent', () => {
  let component: CoconstraintsEditorComponent;
  let fixture: ComponentFixture<CoconstraintsEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoconstraintsEditorComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoconstraintsEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
