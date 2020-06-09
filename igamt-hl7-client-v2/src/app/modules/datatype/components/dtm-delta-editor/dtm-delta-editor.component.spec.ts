import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DtmDeltaEditorComponent } from './dtm-delta-editor.component';

describe('DtmDeltaEditorComponent', () => {
  let component: DtmDeltaEditorComponent;
  let fixture: ComponentFixture<DtmDeltaEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DtmDeltaEditorComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DtmDeltaEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
