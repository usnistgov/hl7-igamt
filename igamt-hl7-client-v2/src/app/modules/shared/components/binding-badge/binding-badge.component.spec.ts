import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BindingBadgeComponent } from './binding-badge.component';

describe('BindingBadgeComponent', () => {
  let component: BindingBadgeComponent;
  let fixture: ComponentFixture<BindingBadgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BindingBadgeComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BindingBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
