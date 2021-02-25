import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SegmentContextStructureEditorComponent } from './segment-context-structure-editor.component';

describe('SegmentContextStructureEditorComponent', () => {
  let component: SegmentContextStructureEditorComponent;
  let fixture: ComponentFixture<SegmentContextStructureEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SegmentContextStructureEditorComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SegmentContextStructureEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
