import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitCodeSetVersionDialogComponent } from './commit-code-set-version-dialog.component';

describe('CommitCodeSetVersionDialogComponent', () => {
  let component: CommitCodeSetVersionDialogComponent;
  let fixture: ComponentFixture<CommitCodeSetVersionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommitCodeSetVersionDialogComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitCodeSetVersionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
