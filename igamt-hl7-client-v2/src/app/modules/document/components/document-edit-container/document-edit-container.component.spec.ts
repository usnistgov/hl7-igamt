import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DocumentEditContainerComponent} from './document-edit-container.component';

describe('DocumentEditContainerComponent', () => {
  let component: DocumentEditContainerComponent;
  let fixture: ComponentFixture<DocumentEditContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentEditContainerComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentEditContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
