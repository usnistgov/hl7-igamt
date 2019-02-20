import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConflengthDeltaColComponent } from './conflength-delta-col.component';

describe('ConflengthDeltaColComponent', () => {
  let component: ConflengthDeltaColComponent;
  let fixture: ComponentFixture<ConflengthDeltaColComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConflengthDeltaColComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConflengthDeltaColComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
