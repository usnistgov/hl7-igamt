import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoConstraintsBindingEditorComponent } from './co-constraints-binding-editor.component';

describe('CoConstraintsBindingEditorComponent', () => {
  let component: CoConstraintsBindingEditorComponent;
  let fixture: ComponentFixture<CoConstraintsBindingEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoConstraintsBindingEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoConstraintsBindingEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
