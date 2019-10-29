import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeriveDialogComponent } from './derive-dialog.component';

describe('DeriveDialogComponent', () => {
  let component: DeriveDialogComponent;
  let fixture: ComponentFixture<DeriveDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeriveDialogComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeriveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
