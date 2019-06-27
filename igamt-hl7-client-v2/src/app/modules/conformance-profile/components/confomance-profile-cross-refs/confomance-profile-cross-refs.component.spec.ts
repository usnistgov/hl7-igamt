import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfomanceProfileCrossRefsComponent } from './confomance-profile-cross-refs.component';

describe('ConfomanceProfileCrossRefsComponent', () => {
  let component: ConfomanceProfileCrossRefsComponent;
  let fixture: ComponentFixture<ConfomanceProfileCrossRefsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfomanceProfileCrossRefsComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfomanceProfileCrossRefsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
