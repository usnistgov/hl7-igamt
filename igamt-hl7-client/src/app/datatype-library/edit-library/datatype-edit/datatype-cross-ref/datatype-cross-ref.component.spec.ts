import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LibDatatypeCrossRefComponent } from './lib-datatype-cross-ref.component';

describe('LibDatatypeCrossRefComponent', () => {
  let component: LibDatatypeCrossRefComponent;
  let fixture: ComponentFixture<LibDatatypeCrossRefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LibDatatypeCrossRefComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibDatatypeCrossRefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
