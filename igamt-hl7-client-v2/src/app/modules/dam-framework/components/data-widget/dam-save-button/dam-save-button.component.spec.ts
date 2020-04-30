import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DamSaveButtonComponent } from './dam-save-button.component';

describe('DamSaveButtonComponent', () => {
  let component: DamSaveButtonComponent;
  let fixture: ComponentFixture<DamSaveButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DamSaveButtonComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DamSaveButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
