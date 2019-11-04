import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeltaExportConfigurationComponent } from './delta-export-configuration.component';

describe('DeltaExportConfigurationComponent', () => {
  let component: DeltaExportConfigurationComponent;
  let fixture: ComponentFixture<DeltaExportConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeltaExportConfigurationComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeltaExportConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
