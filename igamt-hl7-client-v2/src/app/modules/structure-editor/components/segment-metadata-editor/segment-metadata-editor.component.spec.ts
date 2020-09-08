import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SegmentMetadataEditorComponent } from './segment-metadata-editor.component';

describe('SegmentMetadataEditorComponent', () => {
  let component: SegmentMetadataEditorComponent;
  let fixture: ComponentFixture<SegmentMetadataEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SegmentMetadataEditorComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SegmentMetadataEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
