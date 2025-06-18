import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnusedElementsComponent } from './unused-elements.component';

describe('UnusedElementsComponent', () => {
  let component: UnusedElementsComponent;
  let fixture: ComponentFixture<UnusedElementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnusedElementsComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnusedElementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
