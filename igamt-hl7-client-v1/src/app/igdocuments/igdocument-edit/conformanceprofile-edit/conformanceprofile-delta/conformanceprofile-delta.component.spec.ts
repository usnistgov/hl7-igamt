import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConformanceprofileDeltaComponent } from './conformanceprofile-delta.component';

describe('ConformanceprofileDeltaComponent', () => {
  let component: ConformanceprofileDeltaComponent;
  let fixture: ComponentFixture<ConformanceprofileDeltaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConformanceprofileDeltaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConformanceprofileDeltaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
