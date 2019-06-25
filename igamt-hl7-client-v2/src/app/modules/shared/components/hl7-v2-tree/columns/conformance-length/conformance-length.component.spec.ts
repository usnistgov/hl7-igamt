import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConformanceLengthComponent } from './conformance-length.component';

describe('ConformanceLengthComponent', () => {
  let component: ConformanceLengthComponent;
  let fixture: ComponentFixture<ConformanceLengthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConformanceLengthComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConformanceLengthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
