import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordRequestFormComponent } from './reset-password-request-form.component';

describe('ResetPasswordRequestFormComponent', () => {
  let component: ResetPasswordRequestFormComponent;
  let fixture: ComponentFixture<ResetPasswordRequestFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetPasswordRequestFormComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordRequestFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
