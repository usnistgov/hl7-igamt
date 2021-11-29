import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeltaDisplayComponent } from './delta-display.component';

describe('DeltaDisplayComponent', () => {
  let component: DeltaDisplayComponent;
  let fixture: ComponentFixture<DeltaDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeltaDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeltaDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
