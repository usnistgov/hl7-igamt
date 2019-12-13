import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NarrativeHeaderDialogComponent } from './narrative-header-dialog.component';

describe('NarrativeHeaderDialogComponent', () => {
  let component: NarrativeHeaderDialogComponent;
  let fixture: ComponentFixture<NarrativeHeaderDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NarrativeHeaderDialogComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NarrativeHeaderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
