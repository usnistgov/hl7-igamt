import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DamResetButtonComponent } from './dam-reset-button.component';

describe('DamResetButtonComponent', () => {
  let component: DamResetButtonComponent;
  let fixture: ComponentFixture<DamResetButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DamResetButtonComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DamResetButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
