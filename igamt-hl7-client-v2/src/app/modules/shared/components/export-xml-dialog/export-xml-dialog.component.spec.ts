import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportXmlDialogComponent } from './export-xml-dialog.component';

describe('ExportXmlDialogComponent', () => {
  let component: ExportXmlDialogComponent;
  let fixture: ComponentFixture<ExportXmlDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportXmlDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportXmlDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
