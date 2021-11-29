import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatatypeCrossRefsComponent } from './datatype-cross-refs.component';

describe('DatatypeCrossRefsComponent', () => {
  let component: DatatypeCrossRefsComponent;
  let fixture: ComponentFixture<DatatypeCrossRefsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatatypeCrossRefsComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatatypeCrossRefsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
