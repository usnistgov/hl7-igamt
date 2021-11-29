import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatatypeEvolutionComponent } from './datatype-evolution.component';

describe('DatatypeEvolutionComponent', () => {
  let component: DatatypeEvolutionComponent;
  let fixture: ComponentFixture<DatatypeEvolutionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatatypeEvolutionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatatypeEvolutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
