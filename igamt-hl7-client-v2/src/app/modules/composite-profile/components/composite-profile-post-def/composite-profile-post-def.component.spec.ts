import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompositeProfilePostDefComponent } from './composite-profile-post-def.component';

describe('CompositeProfilePostDefComponent', () => {
  let component: CompositeProfilePostDefComponent;
  let fixture: ComponentFixture<CompositeProfilePostDefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompositeProfilePostDefComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompositeProfilePostDefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
