import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeSetEditorCreateComponent } from './code-set-editor-create.component';

describe('CodeSetEditorCreateComponent', () => {
  let component: CodeSetEditorCreateComponent;
  let fixture: ComponentFixture<CodeSetEditorCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeSetEditorCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeSetEditorCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
