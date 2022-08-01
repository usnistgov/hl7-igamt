import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentBrowserComponent } from './document-browser.component';

describe('DocumentBrowserComponent', () => {
  let component: DocumentBrowserComponent;
  let fixture: ComponentFixture<DocumentBrowserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentBrowserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
