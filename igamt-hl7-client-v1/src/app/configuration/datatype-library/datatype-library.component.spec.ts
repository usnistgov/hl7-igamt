import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatatypeLibraryComponent } from './datatype-library.component';

describe('DatatypeLibraryComponent', () => {
  let component: DatatypeLibraryComponent;
  let fixture: ComponentFixture<DatatypeLibraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatatypeLibraryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatatypeLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
