import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlicingEditorComponent } from './slicing-editor.component';

describe('SlicingEditorComponent', () => {
  let component: SlicingEditorComponent;
  let fixture: ComponentFixture<SlicingEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlicingEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlicingEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
