import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DocumentEditSidebarComponent} from './document-edit-sidebar.component';

describe('DocumentEditSidebarComponent', () => {
  let component: DocumentEditSidebarComponent;
  let fixture: ComponentFixture<DocumentEditSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentEditSidebarComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentEditSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
