import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatatypesEvolutionComponent } from './datatypes-evolution.component';

describe('DatatypesEvolutionComponent', () => {
  let component: DatatypesEvolutionComponent;
  let fixture: ComponentFixture<DatatypesEvolutionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatatypesEvolutionComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatatypesEvolutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
