import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddConformanceProfileComponent } from './add-conformance-profile.component';

describe('AddConformanceProfileComponent', () => {
  let component: AddConformanceProfileComponent;
  let fixture: ComponentFixture<AddConformanceProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddConformanceProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddConformanceProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
