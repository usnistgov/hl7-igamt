import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CsSegmentTreeComponent } from './cs-segment-tree.component';

describe('CsSegmentTreeComponent', () => {
  let component: CsSegmentTreeComponent;
  let fixture: ComponentFixture<CsSegmentTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CsSegmentTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CsSegmentTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
