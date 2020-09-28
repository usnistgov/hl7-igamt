import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMappingDialgComponent } from './add-mapping-dialg.component';

describe('AddMappingDialgComponent', () => {
  let component: AddMappingDialgComponent;
  let fixture: ComponentFixture<AddMappingDialgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMappingDialgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMappingDialgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
