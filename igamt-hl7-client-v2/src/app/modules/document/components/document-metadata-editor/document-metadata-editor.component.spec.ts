import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentMetadataEditorComponent } from './document-metadata-editor.component';

describe('DocumentMetadataEditorComponent', () => {
  let component: DocumentMetadataEditorComponent;
  let fixture: ComponentFixture<DocumentMetadataEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentMetadataEditorComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentMetadataEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
