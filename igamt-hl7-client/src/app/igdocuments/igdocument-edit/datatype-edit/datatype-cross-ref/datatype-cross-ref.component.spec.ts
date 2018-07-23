import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatatypeCrossRefComponent } from './datatype-cross-ref.component';

describe('DatatypeCrossRefComponent', () => {
  let component: DatatypeCrossRefComponent;
  let fixture: ComponentFixture<DatatypeCrossRefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatatypeCrossRefComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatatypeCrossRefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
