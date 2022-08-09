import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceListCardComponent } from './workspace-list-card.component';

describe('WorkspaceListCardComponent', () => {
  let component: WorkspaceListCardComponent;
  let fixture: ComponentFixture<WorkspaceListCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkspaceListCardComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkspaceListCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
