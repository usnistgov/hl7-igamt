import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SegmentDeltaComponent } from './segment-delta.component';

describe('SegmentDeltaComponent', () => {
  let component: SegmentDeltaComponent;
  let fixture: ComponentFixture<SegmentDeltaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SegmentDeltaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SegmentDeltaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
