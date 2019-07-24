import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CsPropositionComponent } from './cs-proposition.component';

describe('CsPropositionComponent', () => {
  let component: CsPropositionComponent;
  let fixture: ComponentFixture<CsPropositionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CsPropositionComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CsPropositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
