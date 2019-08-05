import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValueSetExportConfigurationComponent } from './value-set-export-configuration.component';

describe('ValueSetExportConfigurationComponent', () => {
  let component: ValueSetExportConfigurationComponent;
  let fixture: ComponentFixture<ValueSetExportConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValueSetExportConfigurationComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValueSetExportConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
