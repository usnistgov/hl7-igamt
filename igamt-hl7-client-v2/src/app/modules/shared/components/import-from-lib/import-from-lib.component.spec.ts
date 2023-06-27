import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportFromLibComponent } from './import-from-lib.component';

describe('ImportFromLibComponent', () => {
  let component: ImportFromLibComponent;
  let fixture: ComponentFixture<ImportFromLibComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportFromLibComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportFromLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
