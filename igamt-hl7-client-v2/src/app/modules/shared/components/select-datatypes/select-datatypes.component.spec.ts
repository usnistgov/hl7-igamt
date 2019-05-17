import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectDatatypesComponent } from './select-datatypes.component';

describe('SelectDatatypesComponent', () => {
  let component: SelectDatatypesComponent;
  let fixture: ComponentFixture<SelectDatatypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectDatatypesComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectDatatypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
