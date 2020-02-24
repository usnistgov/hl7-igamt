import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentationListComponent } from './documentation-list.component';

describe('DocumentationListComponent', () => {
  let component: DocumentationListComponent;
  let fixture: ComponentFixture<DocumentationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
