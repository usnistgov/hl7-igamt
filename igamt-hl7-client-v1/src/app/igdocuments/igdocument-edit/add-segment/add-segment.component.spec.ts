import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSegmentComponent } from './add-segment.component';

describe('AddSegmentComponent', () => {
  let component: AddSegmentComponent;
  let fixture: ComponentFixture<AddSegmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSegmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSegmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
