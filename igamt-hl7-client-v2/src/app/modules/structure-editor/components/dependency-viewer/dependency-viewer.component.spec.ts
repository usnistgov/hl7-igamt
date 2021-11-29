import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DependencyViewerComponent } from './dependency-viewer.component';

describe('DependencyViewerComponent', () => {
  let component: DependencyViewerComponent;
  let fixture: ComponentFixture<DependencyViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DependencyViewerComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DependencyViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
