import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DamFrameworkModule } from '../dam-framework/dam-framework.module';
import { SharedModule } from '../shared/shared.module';
import { WorkspaceComponent } from './workspace/workspace.component';
import { WorkspacesRoutingModule } from './workspaces-routing.module';
import { ContextMenuModule } from 'primeng/primeng';

@NgModule({
  declarations: [WorkspaceComponent],
  imports: [
    DamFrameworkModule.forRoot(),
    CommonModule,
    SharedModule,
    WorkspacesRoutingModule,
    ContextMenuModule,
  ],
})
export class WorkspacesModule { }
