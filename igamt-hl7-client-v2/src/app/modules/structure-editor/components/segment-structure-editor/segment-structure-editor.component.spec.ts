import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SegmentStructureEditorComponent } from './segment-structure-editor.component';

describe('SegmentStructureEditorComponent', () => {
  let component: SegmentStructureEditorComponent;
  let fixture: ComponentFixture<SegmentStructureEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SegmentStructureEditorComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SegmentStructureEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
