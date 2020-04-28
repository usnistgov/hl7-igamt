import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharingDialogComponent } from './sharing-dialog.component';

describe('SharingDialogComponent', () => {
  let component: SharingDialogComponent;
  let fixture: ComponentFixture<SharingDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharingDialogComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
