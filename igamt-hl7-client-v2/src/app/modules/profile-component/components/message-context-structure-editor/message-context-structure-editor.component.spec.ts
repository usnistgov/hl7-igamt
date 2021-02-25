import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageContextStructureEditorComponent } from './message-context-structure-editor.component';

describe('MessageContextStructureEditorComponent', () => {
  let component: MessageContextStructureEditorComponent;
  let fixture: ComponentFixture<MessageContextStructureEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageContextStructureEditorComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageContextStructureEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
