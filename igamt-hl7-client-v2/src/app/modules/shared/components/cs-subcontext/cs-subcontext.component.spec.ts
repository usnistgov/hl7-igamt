import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CsSubcontextComponent } from './cs-subcontext.component';

describe('CsSubcontextComponent', () => {
  let component: CsSubcontextComponent;
  let fixture: ComponentFixture<CsSubcontextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CsSubcontextComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CsSubcontextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
