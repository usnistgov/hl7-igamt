import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SegmentMetadataComponent } from './segment-metadata.component';

describe('SegmentMetadataComponent', () => {
  let component: SegmentMetadataComponent;
  let fixture: ComponentFixture<SegmentMetadataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SegmentMetadataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SegmentMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
