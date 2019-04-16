import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportFontComponent } from './export-font.component';

describe('ExportFontComponent', () => {
  let component: ExportFontComponent;
  let fixture: ComponentFixture<ExportFontComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportFontComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportFontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
