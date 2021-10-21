import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConformanceProfileSlicingEditorComponent } from './conformance-profile-slicing-editor.component';

describe('ConformanceProfileSlicingEditorComponent', () => {
  let component: ConformanceProfileSlicingEditorComponent;
  let fixture: ComponentFixture<ConformanceProfileSlicingEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConformanceProfileSlicingEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConformanceProfileSlicingEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
