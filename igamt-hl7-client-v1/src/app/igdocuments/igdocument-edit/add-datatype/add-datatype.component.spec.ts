import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDatatypeComponent } from './add-datatype.component';

describe('AddDatatypeLibComponent', () => {
  let component: AddDatatypeComponent;
  let fixture: ComponentFixture<AddDatatypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDatatypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDatatypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
