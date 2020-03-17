import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DocumentListContainerComponent} from './document-list-container.component';

describe('DocumentListContainerComponent', () => {
  let component: DocumentListContainerComponent;
  let fixture: ComponentFixture<DocumentListContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentListContainerComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentListContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
