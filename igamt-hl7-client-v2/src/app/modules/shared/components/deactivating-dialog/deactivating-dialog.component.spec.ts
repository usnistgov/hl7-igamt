import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeactivatingDialogComponent } from './deactivating-dialog.component';

describe('DeactivatingDialogComponent', () => {
  let component: DeactivatingDialogComponent;
  let fixture: ComponentFixture<DeactivatingDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeactivatingDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeactivatingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
