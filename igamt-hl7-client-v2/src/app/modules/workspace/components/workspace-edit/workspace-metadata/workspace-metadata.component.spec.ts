import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceMetadataComponent } from './workspace-metadata.component';

describe('WorkspaceMetadataComponent', () => {
  let component: WorkspaceMetadataComponent;
  let fixture: ComponentFixture<WorkspaceMetadataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkspaceMetadataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkspaceMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
