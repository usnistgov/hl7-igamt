import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcePickerComponent } from './resource-picker.component';

describe('ResourcePickerComponent', () => {
  let component: ResourcePickerComponent;
  let fixture: ComponentFixture<ResourcePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourcePickerComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourcePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
