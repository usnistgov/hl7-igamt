import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoConstraintCrossRefComponent } from './co-constraint-cross-ref.component';

describe('CoConstraintCrossRefComponent', () => {
  let component: CoConstraintCrossRefComponent;
  let fixture: ComponentFixture<CoConstraintCrossRefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoConstraintCrossRefComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoConstraintCrossRefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
