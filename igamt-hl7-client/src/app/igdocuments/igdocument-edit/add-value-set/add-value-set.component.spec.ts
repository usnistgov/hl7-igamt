import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddValueSetComponent } from './add-value-set.component';

describe('AddValueSetComponent', () => {
  let component: AddValueSetComponent;
  let fixture: ComponentFixture<AddValueSetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddValueSetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddValueSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
