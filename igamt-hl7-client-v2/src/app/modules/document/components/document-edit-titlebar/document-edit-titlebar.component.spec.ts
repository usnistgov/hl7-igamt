import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DocumentEditTitlebarComponent} from './document-edit-titlebar.component';

describe('DocumentEditTitlebarComponent', () => {
  let component: DocumentEditTitlebarComponent;
  let fixture: ComponentFixture<DocumentEditTitlebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentEditTitlebarComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentEditTitlebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
