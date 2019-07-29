import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StringListComponent } from './string-list.component';

describe('StringListComponent', () => {
  let component: StringListComponent;
  let fixture: ComponentFixture<StringListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StringListComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StringListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
