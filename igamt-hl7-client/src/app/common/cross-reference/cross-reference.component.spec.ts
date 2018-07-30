import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrossReferenceComponent } from './cross-reference.component';

describe('CrossReferenceComponent', () => {
  let component: CrossReferenceComponent;
  let fixture: ComponentFixture<CrossReferenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrossReferenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrossReferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
