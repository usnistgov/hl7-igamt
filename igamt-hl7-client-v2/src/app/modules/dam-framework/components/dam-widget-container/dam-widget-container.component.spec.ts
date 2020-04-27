import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DamWidgetContainerComponent } from './dam-widget-container.component';

describe('DamWidgetContainerComponent', () => {
  let component: DamWidgetContainerComponent;
  let fixture: ComponentFixture<DamWidgetContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DamWidgetContainerComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DamWidgetContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
