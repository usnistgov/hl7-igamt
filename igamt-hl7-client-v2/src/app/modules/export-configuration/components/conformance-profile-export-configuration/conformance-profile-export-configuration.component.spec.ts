import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConformanceProfileExportConfigurationComponent } from './conformance-profile-export-configuration.component';

describe('ConformanceProfileExportConfigurationComponent', () => {
  let component: ConformanceProfileExportConfigurationComponent;
  let fixture: ComponentFixture<ConformanceProfileExportConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConformanceProfileExportConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConformanceProfileExportConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
