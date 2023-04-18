import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagePickerComponent } from './message-picker.component';

describe('MessagePickerComponent', () => {
  let component: MessagePickerComponent;
  let fixture: ComponentFixture<MessagePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessagePickerComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
