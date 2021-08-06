import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicMappingDeltaComponent } from './dynamic-mapping-delta.component';

describe('DynamicMappingDeltaComponent', () => {
  let component: DynamicMappingDeltaComponent;
  let fixture: ComponentFixture<DynamicMappingDeltaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicMappingDeltaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicMappingDeltaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
