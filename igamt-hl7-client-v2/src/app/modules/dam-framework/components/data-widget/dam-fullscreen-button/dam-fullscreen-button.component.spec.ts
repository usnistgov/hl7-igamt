import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DamFullscreenButtonComponent } from './dam-fullscreen-button.component';

describe('DamFullscreenButtonComponent', () => {
  let component: DamFullscreenButtonComponent;
  let fixture: ComponentFixture<DamFullscreenButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DamFullscreenButtonComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DamFullscreenButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
