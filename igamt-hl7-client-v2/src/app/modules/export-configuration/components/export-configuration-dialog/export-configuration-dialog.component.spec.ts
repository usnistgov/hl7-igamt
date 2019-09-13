import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportConfigurationDialogComponent } from './export-configuration-dialog.component';

describe('ExportConfigurationDialogComponent', () => {
  let component: ExportConfigurationDialogComponent;
  let fixture: ComponentFixture<ExportConfigurationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportConfigurationDialogComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportConfigurationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
