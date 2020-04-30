import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DamSideBarToggleComponent } from './dam-side-bar-toggle.component';

describe('DamSideBarToggleComponent', () => {
  let component: DamSideBarToggleComponent;
  let fixture: ComponentFixture<DamSideBarToggleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DamSideBarToggleComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DamSideBarToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
