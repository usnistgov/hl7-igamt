import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IgMetadataEditorComponent } from './ig-metadata-editor.component';

describe('IgMetadataEditorComponent', () => {
  let component: IgMetadataEditorComponent;
  let fixture: ComponentFixture<IgMetadataEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IgMetadataEditorComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IgMetadataEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
