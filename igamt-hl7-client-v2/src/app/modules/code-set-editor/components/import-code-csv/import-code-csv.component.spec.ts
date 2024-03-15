import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportCodeCSVComponent } from './import-code-csv.component';

describe('ImportCodeCSVComponent', () => {
  let component: ImportCodeCSVComponent;
  let fixture: ComponentFixture<ImportCodeCSVComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportCodeCSVComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportCodeCSVComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
