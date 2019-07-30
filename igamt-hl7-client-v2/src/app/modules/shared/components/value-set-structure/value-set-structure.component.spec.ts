import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValueSetStructureComponent } from './value-set-structure.component';

describe('ValueSetStructureComponent', () => {
  let component: ValueSetStructureComponent;
  let fixture: ComponentFixture<ValueSetStructureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValueSetStructureComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValueSetStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
