import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProfileComponentComponent } from './add-profile-component.component';

describe('AddProfileComponentComponent', () => {
  let component: AddProfileComponentComponent;
  let fixture: ComponentFixture<AddProfileComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddProfileComponentComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProfileComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
