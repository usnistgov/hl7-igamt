import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyIgDialogComponent } from './verify-ig-dialog.component';

describe('VerifyIgDialogComponent', () => {
  let component: ExportXmlDialogComponent;
  let fixture: ComponentFixture<VerifyIgDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyIgDialogComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyIgDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
