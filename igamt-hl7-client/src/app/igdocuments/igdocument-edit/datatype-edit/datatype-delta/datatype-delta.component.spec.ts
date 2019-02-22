import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatatypeDeltaComponent } from './datatype-delta.component';

describe('DatatypeDeltaComponent', () => {
  let component: DatatypeDeltaComponent;
  let fixture: ComponentFixture<DatatypeDeltaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatatypeDeltaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatatypeDeltaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
