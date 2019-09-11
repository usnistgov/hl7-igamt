import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SegmentExportConfigurationComponent } from './segment-export-configuration.component';

describe('SegmentExportConfigurationComponent', () => {
  let component: SegmentExportConfigurationComponent;
  let fixture: ComponentFixture<SegmentExportConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SegmentExportConfigurationComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SegmentExportConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
