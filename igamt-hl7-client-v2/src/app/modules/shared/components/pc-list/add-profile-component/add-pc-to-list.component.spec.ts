import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPcToList } from './add-pc-to-list.component';

describe('AddProfileComponentComponent', () => {
  let component: AddPcToList;
  let fixture: ComponentFixture<AddPcToList>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPcToList ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPcToList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
