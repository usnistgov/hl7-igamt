import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCompositeComponent } from './add-composite.component';

describe('AddCompositeComponent', () => {
  let component: AddCompositeComponent;
  let fixture: ComponentFixture<AddCompositeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCompositeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCompositeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
