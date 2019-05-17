import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IgSectionEditorComponent } from './ig-section-editor.component';

describe('IgSectionEditorComponent', () => {
  let component: IgSectionEditorComponent;
  let fixture: ComponentFixture<IgSectionEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IgSectionEditorComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IgSectionEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
