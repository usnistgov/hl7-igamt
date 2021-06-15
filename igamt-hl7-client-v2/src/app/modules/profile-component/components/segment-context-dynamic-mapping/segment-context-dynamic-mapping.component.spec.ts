import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SegmentContextDynamicMappingComponent } from './segment-context-dynamic-mapping.component';

describe('SegmentContextDynamicMappingComponent', () => {
  let component: SegmentContextDynamicMappingComponent;
  let fixture: ComponentFixture<SegmentContextDynamicMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SegmentContextDynamicMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SegmentContextDynamicMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
