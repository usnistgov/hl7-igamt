import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentEditActiveTitlebarComponent } from './document-edit-active-titlebar.component';

describe('DocumentEditActiveTitlebarComponent', () => {
  let component: DocumentEditActiveTitlebarComponent;
  let fixture: ComponentFixture<DocumentEditActiveTitlebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentEditActiveTitlebarComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentEditActiveTitlebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
