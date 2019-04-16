import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompositeProfileTableOptionsComponent } from './composite-profile-table-options.component';

describe('CompositeProfileTableOptionsComponent', () => {
  let component: CompositeProfileTableOptionsComponent;
  let fixture: ComponentFixture<CompositeProfileTableOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompositeProfileTableOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompositeProfileTableOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
