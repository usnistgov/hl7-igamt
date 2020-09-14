import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FontExportConfigurationComponent } from './font-export-configuration.component';

describe('FontExportConfigurationComponent', () => {
  let component: FontExportConfigurationComponent;
  let fixture: ComponentFixture<FontExportConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FontExportConfigurationComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FontExportConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
