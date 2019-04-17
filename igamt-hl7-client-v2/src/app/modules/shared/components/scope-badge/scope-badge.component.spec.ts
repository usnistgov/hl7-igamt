import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScopeBadgeComponent } from './scope-badge.component';

describe('ScopeBadgeComponent', () => {
  let component: ScopeBadgeComponent;
  let fixture: ComponentFixture<ScopeBadgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScopeBadgeComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScopeBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
