import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SegmentSlicingEditorComponent } from './segment-slicing-editor.component';

describe('SegmentSlicingEditorComponent', () => {
  let component: SegmentSlicingEditorComponent;
  let fixture: ComponentFixture<SegmentSlicingEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SegmentSlicingEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SegmentSlicingEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
