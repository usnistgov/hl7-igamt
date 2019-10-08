import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicMappingComponent } from './dynamic-mapping.component';

describe('DynamicMappingComponent', () => {
  let component: DynamicMappingComponent;
  let fixture: ComponentFixture<DynamicMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicMappingComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
