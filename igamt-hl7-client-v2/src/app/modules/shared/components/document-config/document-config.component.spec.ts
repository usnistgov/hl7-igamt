import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentConfigComponent } from './document-config.component';

describe('DocumentConfigComponent', () => {
  let component: DocumentConfigComponent;
  let fixture: ComponentFixture<DocumentConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
