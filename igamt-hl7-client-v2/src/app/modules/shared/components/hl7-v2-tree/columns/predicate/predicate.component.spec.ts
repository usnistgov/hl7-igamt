import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PredicateComponent } from './predicate.component';

describe('PredicateComponent', () => {
  let component: PredicateComponent;
  let fixture: ComponentFixture<PredicateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PredicateComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PredicateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
