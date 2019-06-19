import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceMetadataEditorComponent } from './resource-metadata-editor.component';

describe('ResourceMetadataEditorComponent', () => {
  let component: ResourceMetadataEditorComponent;
  let fixture: ComponentFixture<ResourceMetadataEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourceMetadataEditorComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceMetadataEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
