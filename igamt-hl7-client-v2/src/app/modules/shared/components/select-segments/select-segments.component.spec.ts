import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectSegmentsComponent } from './select-segments.component';

describe('SelectSegmentsComponent', () => {
  let component: SelectSegmentsComponent;
  let fixture: ComponentFixture<SelectSegmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectSegmentsComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectSegmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
