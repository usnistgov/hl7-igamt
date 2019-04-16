import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LengthDeltaColComponent } from './length-delta-col.component';

describe('LengthDeltaColComponent', () => {
  let component: LengthDeltaColComponent;
  let fixture: ComponentFixture<LengthDeltaColComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LengthDeltaColComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LengthDeltaColComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
