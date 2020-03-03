import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentationContainerComponent } from './documentation-contrainer.component';

describe('DocumentationContainerComponent', () => {
  let component: DocumentationContainerComponent;
  let fixture: ComponentFixture<DocumentationContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentationContainerComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentationContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
