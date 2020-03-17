import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DocumentTocComponent} from './document-toc.component';

describe('DocumentTocComponent', () => {
  let component: DocumentTocComponent;
  let fixture: ComponentFixture<DocumentTocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentTocComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentTocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
