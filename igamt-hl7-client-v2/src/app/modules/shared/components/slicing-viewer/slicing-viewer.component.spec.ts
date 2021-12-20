import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlicingViewerComponent } from './slicing-viewer.component';

describe('SlicingViewerComponent', () => {
  let component: SlicingViewerComponent;
  let fixture: ComponentFixture<SlicingViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlicingViewerComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlicingViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
