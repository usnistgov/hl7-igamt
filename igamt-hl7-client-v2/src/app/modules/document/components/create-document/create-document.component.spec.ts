import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateDocumentComponent} from './create-document.component';

describe('CreateIGComponent', () => {
  let component: CreateDocumentComponent;
  let fixture: ComponentFixture<CreateDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateDocumentComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
