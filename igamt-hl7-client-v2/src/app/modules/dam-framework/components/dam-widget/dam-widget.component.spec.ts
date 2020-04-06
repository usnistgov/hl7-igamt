import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DamWidgetComponent } from './dam-widget.component';

describe('DamWidgetComponent', () => {
  let component: DamWidgetComponent;
  let fixture: ComponentFixture<DamWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DamWidgetComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DamWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
