import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayRefComponent } from './display-ref.component';

describe('DisplayRefComponent', () => {
  let component: DisplayRefComponent;
  let fixture: ComponentFixture<DisplayRefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayRefComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayRefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
