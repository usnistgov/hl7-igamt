import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SegmentCrossRefComponent } from './segment-cross-ref.component';

describe('SegmentCrossRefComponent', () => {
  let component: SegmentCrossRefComponent;
  let fixture: ComponentFixture<SegmentCrossRefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SegmentCrossRefComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SegmentCrossRefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
