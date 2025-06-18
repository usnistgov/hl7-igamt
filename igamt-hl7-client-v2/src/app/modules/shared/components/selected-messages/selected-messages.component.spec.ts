import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedMessagesComponent } from './selected-messages.component';

describe('SelectedMessagesComponent', () => {
  let component: SelectedMessagesComponent;
  let fixture: ComponentFixture<SelectedMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectedMessagesComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
