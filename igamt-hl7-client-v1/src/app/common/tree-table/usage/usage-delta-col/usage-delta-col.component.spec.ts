import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsageDeltaColComponent } from './usage-delta-col.component';

describe('UsageDeltaColComponent', () => {
  let component: UsageDeltaColComponent;
  let fixture: ComponentFixture<UsageDeltaColComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsageDeltaColComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsageDeltaColComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
