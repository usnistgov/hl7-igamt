import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CsDialogComponent } from './cs-dialog.component';

describe('CsDialogComponent', () => {
  let component: CsDialogComponent;
  let fixture: ComponentFixture<CsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CsDialogComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
