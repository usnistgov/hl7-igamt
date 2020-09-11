import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeLogInfoComponent } from './change-log-info.component';

describe('ChangeLogInfoComponent', () => {
  let component: ChangeLogInfoComponent;
  let fixture: ComponentFixture<ChangeLogInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeLogInfoComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeLogInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
