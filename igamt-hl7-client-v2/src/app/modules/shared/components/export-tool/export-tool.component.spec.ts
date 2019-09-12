import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportToolComponent } from './export-tool.component';

describe('ExportToolComponent', () => {
  let component: ExportToolComponent;
  let fixture: ComponentFixture<ExportToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
