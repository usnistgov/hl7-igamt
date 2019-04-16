import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NameDeltaColComponent } from './name-delta-col.component';

describe('NameDeltaColComponent', () => {
  let component: NameDeltaColComponent;
  let fixture: ComponentFixture<NameDeltaColComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NameDeltaColComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NameDeltaColComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
