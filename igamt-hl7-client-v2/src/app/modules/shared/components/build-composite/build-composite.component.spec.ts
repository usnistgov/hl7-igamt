import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildCompositeComponent } from './build-composite.component';

describe('BuildCompositeComponent', () => {
  let component: BuildCompositeComponent;
  let fixture: ComponentFixture<BuildCompositeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuildCompositeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildCompositeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
