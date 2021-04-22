import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompositeProfilePreDefComponent } from './composite-profile-pre-def.component';

describe('CompositeProfilePreDefComponent', () => {
  let component: CompositeProfilePreDefComponent;
  let fixture: ComponentFixture<CompositeProfilePreDefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompositeProfilePreDefComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompositeProfilePreDefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
