import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementLabelComponent } from './element-label.component';

describe('ElementLabelComponent', () => {
  let component: ElementLabelComponent;
  let fixture: ComponentFixture<ElementLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElementLabelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
