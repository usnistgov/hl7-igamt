import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReasonForChangeDialogComponent } from './reason-for-change-dialog.component';

describe('ReasonForChangeDialogComponent', () => {
  let component: ReasonForChangeDialogComponent;
  let fixture: ComponentFixture<ReasonForChangeDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReasonForChangeDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReasonForChangeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
