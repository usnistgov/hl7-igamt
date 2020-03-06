import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentationSubtitleComponent } from './documentation-subtitle.component';

describe('DocumentationSubtitleComponent', () => {
  let component: DocumentationSubtitleComponent;
  let fixture: ComponentFixture<DocumentationSubtitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentationSubtitleComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentationSubtitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
