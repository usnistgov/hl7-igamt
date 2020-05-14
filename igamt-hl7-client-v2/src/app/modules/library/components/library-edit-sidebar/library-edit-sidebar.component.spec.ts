import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LibraryEditSidebarComponent} from './library-edit-sidebar.component';

describe('LibraryEditSidebarComponent', () => {
  let component: LibraryEditSidebarComponent;
  let fixture: ComponentFixture<LibraryEditSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LibraryEditSidebarComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibraryEditSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
