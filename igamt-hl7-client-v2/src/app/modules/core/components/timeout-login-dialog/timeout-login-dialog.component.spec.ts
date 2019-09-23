import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeoutLoginDialogComponent } from './timeout-login-dialog.component';

describe('TimeoutLoginDialogComponent', () => {
  let component: TimeoutLoginDialogComponent;
  let fixture: ComponentFixture<TimeoutLoginDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeoutLoginDialogComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeoutLoginDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
