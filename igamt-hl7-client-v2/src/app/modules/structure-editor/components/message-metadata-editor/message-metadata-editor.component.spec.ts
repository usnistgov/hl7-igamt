import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageMetadataEditorComponent } from './message-metadata-editor.component';

describe('MessageMetadataEditorComponent', () => {
  let component: MessageMetadataEditorComponent;
  let fixture: ComponentFixture<MessageMetadataEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageMetadataEditorComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageMetadataEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
