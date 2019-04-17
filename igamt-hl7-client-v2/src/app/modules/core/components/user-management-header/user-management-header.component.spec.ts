import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserManagementHeaderComponent } from './user-management-header.component';

describe('UserManagementHeaderComponent', () => {
  let component: UserManagementHeaderComponent;
  let fixture: ComponentFixture<UserManagementHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserManagementHeaderComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManagementHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
