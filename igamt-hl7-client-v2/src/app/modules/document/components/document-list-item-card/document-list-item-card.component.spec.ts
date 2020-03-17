import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DocumentListItemCardComponent} from './document-list-item-card.component';

describe('DocumentListItemCardComponent', () => {
  let component: DocumentListItemCardComponent;
  let fixture: ComponentFixture<DocumentListItemCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentListItemCardComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentListItemCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
