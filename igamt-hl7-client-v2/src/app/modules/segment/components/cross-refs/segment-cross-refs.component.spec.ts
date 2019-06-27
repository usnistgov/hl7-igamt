import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SegmentCrossRefsComponent } from './segment-cross-refs.component';

describe('SegmentCrossRefsComponent', () => {
  let component: SegmentCrossRefsComponent;
  let fixture: ComponentFixture<SegmentCrossRefsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SegmentCrossRefsComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SegmentCrossRefsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
