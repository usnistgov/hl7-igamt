import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentSectionEditorComponent } from './document-section-editor.component';

describe('DocumentSectionEditorComponent', () => {
  let component: DocumentSectionEditorComponent;
  let fixture: ComponentFixture<DocumentSectionEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentSectionEditorComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentSectionEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
