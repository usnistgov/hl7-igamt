import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardinalityDeltaColComponent } from './cardinality-delta-col.component';

describe('CardinalityDeltaColComponent', () => {
  let component: CardinalityDeltaColComponent;
  let fixture: ComponentFixture<CardinalityDeltaColComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardinalityDeltaColComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardinalityDeltaColComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
