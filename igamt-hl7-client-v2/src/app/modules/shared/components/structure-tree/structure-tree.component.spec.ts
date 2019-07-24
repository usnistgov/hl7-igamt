import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StructureTreeComponent } from './structure-tree.component';

describe('StructureTreeComponent', () => {
  let component: StructureTreeComponent;
  let fixture: ComponentFixture<StructureTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StructureTreeComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StructureTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
