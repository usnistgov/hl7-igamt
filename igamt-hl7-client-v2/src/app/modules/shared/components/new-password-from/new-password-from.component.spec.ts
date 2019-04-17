import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPasswordFromComponent } from './new-password-from.component';

describe('NewPasswordFromComponent', () => {
  let component: NewPasswordFromComponent;
  let fixture: ComponentFixture<NewPasswordFromComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPasswordFromComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPasswordFromComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
