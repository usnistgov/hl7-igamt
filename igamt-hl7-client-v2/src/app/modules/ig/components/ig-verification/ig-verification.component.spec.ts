import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IgVerificationComponent } from './ig-verification.component';

describe('IgVerificationComponent', () => {
  let component: IgVerificationComponent;
  let fixture: ComponentFixture<IgVerificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IgVerificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IgVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
