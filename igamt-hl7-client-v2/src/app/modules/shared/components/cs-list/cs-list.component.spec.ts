import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CsListComponent } from './cs-list.component';

describe('CsListComponent', () => {
  let component: CsListComponent;
  let fixture: ComponentFixture<CsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CsListComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
