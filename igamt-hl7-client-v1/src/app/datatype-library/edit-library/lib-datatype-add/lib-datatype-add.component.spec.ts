import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LibDatatypeAddComponent } from './lib-datatype-add.component';

describe('LibDatatypeAddComponent', () => {
  let component: LibDatatypeAddComponent;
  let fixture: ComponentFixture<LibDatatypeAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LibDatatypeAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibDatatypeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
