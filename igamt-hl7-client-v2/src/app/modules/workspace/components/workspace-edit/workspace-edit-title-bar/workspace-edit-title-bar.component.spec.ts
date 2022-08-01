import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceEditTitleBarComponent } from './workspace-edit-title-bar.component';

describe('WorkspaceEditTitleBarComponent', () => {
  let component: WorkspaceEditTitleBarComponent;
  let fixture: ComponentFixture<WorkspaceEditTitleBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkspaceEditTitleBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkspaceEditTitleBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
