import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildValueSetComponent } from './build-value-set.component';

describe('BuildValueSetComponent', () => {
  let component: BuildValueSetComponent;
  let fixture: ComponentFixture<BuildValueSetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuildValueSetComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildValueSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
