import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatatypeTableOptionsComponent } from './datatype-table-options.component';

describe('DatatypeTableOptionsComponent', () => {
  let component: DatatypeTableOptionsComponent;
  let fixture: ComponentFixture<DatatypeTableOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatatypeTableOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatatypeTableOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
