import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeSetVersionEditorComponent } from './code-set-version-editor.component';

describe('CodeSetVersionEditorComponent', () => {
  let component: CodeSetVersionEditorComponent;
  let fixture: ComponentFixture<CodeSetVersionEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeSetVersionEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeSetVersionEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
