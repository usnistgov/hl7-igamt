import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentationContentComponent } from './documentation-content.component';

describe('DocumentationContentComponent', () => {
  let component: DocumentationContentComponent;
  let fixture: ComponentFixture<DocumentationContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentationContentComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentationContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
