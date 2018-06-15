import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConformanceProfileTableOptionsComponent } from './conformance-profile-table-options.component';

describe('ConformanceProfileTableOptionsComponent', () => {
  let component: ConformanceProfileTableOptionsComponent;
  let fixture: ComponentFixture<ConformanceProfileTableOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConformanceProfileTableOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConformanceProfileTableOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
