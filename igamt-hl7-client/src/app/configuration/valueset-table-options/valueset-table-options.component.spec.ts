import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValuesetTableOptionsComponent } from './valueset-table-options.component';

describe('ValuesetTableOptionsComponent', () => {
  let component: ValuesetTableOptionsComponent;
  let fixture: ComponentFixture<ValuesetTableOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValuesetTableOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValuesetTableOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
