import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NarrativeSectionFormComponent } from './narrative-section-form.component';

describe('NarrativeSectionFormComponent', () => {
  let component: NarrativeSectionFormComponent;
  let fixture: ComponentFixture<NarrativeSectionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NarrativeSectionFormComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NarrativeSectionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
