import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProfileComponentContextComponent } from './add-profile-component-context.component';

describe('AddProfileComponentContextComponent', () => {
  let component: AddProfileComponentContextComponent;
  let fixture: ComponentFixture<AddProfileComponentContextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddProfileComponentContextComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProfileComponentContextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
