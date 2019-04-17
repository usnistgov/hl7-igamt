import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetadataDateComponent } from './metadata-date.component';

describe('MetadataDateComponent', () => {
  let component: MetadataDateComponent;
  let fixture: ComponentFixture<MetadataDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MetadataDateComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetadataDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
