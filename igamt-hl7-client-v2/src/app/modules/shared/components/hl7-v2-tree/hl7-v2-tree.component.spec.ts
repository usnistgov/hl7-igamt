import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Hl7V2TreeComponent } from './hl7-v2-tree.component';

describe('Hl7V2TreeComponent', () => {
  let component: Hl7V2TreeComponent;
  let fixture: ComponentFixture<Hl7V2TreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Hl7V2TreeComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Hl7V2TreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
