import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentationEditorComponent } from './documentation-editor.component';

describe('DocumentationEditorComponent', () => {
  let component: DocumentationEditorComponent;
  let fixture: ComponentFixture<DocumentationEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentationEditorComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentationEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
