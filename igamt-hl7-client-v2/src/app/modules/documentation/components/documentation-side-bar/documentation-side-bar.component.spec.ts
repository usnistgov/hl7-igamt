import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentationSideBarComponent } from './documentation-side-bar.component';

describe('DocumentationSideBarComponent', () => {
  let component: DocumentationSideBarComponent;
  let fixture: ComponentFixture<DocumentationSideBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentationSideBarComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentationSideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
