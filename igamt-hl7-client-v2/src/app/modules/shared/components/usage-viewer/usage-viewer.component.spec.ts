import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsageViewerComponent } from './usage-viewer.component';

describe('UsageViewerComponent', () => {
  let component: UsageViewerComponent;
  let fixture: ComponentFixture<UsageViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsageViewerComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsageViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
