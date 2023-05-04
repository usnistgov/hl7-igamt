import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefreshDialogComponent } from './refresh-dialog.component';

describe('RefreshDialogComponent', () => {
  let component: RefreshDialogComponent;
  let fixture: ComponentFixture<RefreshDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefreshDialogComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefreshDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
