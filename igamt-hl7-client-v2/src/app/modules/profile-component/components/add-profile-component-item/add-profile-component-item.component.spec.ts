import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProfileComponentItemComponent } from './add-profile-component-item.component';

describe('AddProfileComponentItemComponent', () => {
  let component: AddProfileComponentItemComponent;
  let fixture: ComponentFixture<AddProfileComponentItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddProfileComponentItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProfileComponentItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
