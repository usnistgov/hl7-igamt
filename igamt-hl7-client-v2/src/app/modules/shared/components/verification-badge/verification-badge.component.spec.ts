import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationBadgeComponent } from './verification-badge.component';

describe('VerificationBadgeComponent', () => {
  let component: VerificationBadgeComponent;
  let fixture: ComponentFixture<VerificationBadgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerificationBadgeComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificationBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
