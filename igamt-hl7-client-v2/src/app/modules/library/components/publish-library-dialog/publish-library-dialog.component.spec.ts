import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishLibraryDialogComponent } from './publish-library-dialog.component';

describe('PublishLibraryDialogComponent', () => {
  let component: PublishLibraryDialogComponent;
  let fixture: ComponentFixture<PublishLibraryDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublishLibraryDialogComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishLibraryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
