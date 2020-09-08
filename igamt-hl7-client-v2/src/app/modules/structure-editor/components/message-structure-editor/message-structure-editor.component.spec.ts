import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageStructureEditorComponent } from './message-structure-editor.component';

describe('MessageStructureEditorComponent', () => {
  let component: MessageStructureEditorComponent;
  let fixture: ComponentFixture<MessageStructureEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageStructureEditorComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageStructureEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
