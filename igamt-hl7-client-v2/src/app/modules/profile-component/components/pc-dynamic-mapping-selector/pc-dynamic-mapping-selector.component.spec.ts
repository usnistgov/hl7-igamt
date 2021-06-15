import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PcDynamicMappingSelectorComponent } from './pc-dynamic-mapping-selector.component';

describe('PcDynamicMappingSelectorComponent', () => {
  let component: PcDynamicMappingSelectorComponent;
  let fixture: ComponentFixture<PcDynamicMappingSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PcDynamicMappingSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PcDynamicMappingSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
