import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectMessagesComponent } from './select-messages.component';

describe('SelectMessagesComponent', () => {
  let component: SelectMessagesComponent;
  let fixture: ComponentFixture<SelectMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectMessagesComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
