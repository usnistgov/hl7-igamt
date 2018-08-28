import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SegmentTableOptionsComponent } from './segment-table-options.component';

describe('SegmentTableOptionsComponent', () => {
  let component: SegmentTableOptionsComponent;
  let fixture: ComponentFixture<SegmentTableOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SegmentTableOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SegmentTableOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
