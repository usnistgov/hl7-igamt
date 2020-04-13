import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDatatypeLibraryComponent } from './create-datatype-library.component';

describe('CreateDatatypeLibraryComponent', () => {
  let component: CreateDatatypeLibraryComponent;
  let fixture: ComponentFixture<CreateDatatypeLibraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateDatatypeLibraryComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDatatypeLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
