import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatatypeDeltaColComponent } from './datatype-delta-col.component';

describe('DatatypeDeltaColComponent', () => {
  let component: DatatypeDeltaColComponent;
  let fixture: ComponentFixture<DatatypeDeltaColComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatatypeDeltaColComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatatypeDeltaColComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
