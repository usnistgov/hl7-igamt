import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DamLayoutComponent } from './dam-layout.component';

describe('DamLayoutComponent', () => {
  let component: DamLayoutComponent;
  let fixture: ComponentFixture<DamLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DamLayoutComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DamLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
