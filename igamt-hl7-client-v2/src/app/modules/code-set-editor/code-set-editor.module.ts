import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CodeSetEditorListComponent } from './components/code-set-editor-list/code-set-editor-list.component';
import { CodeSetEditorCreateComponent } from './components/code-set-editor-create/code-set-editor-create.component';
import { CodeSetEditorComponent } from './components/code-set-editor/code-set-editor.component';
import { CodeSetVersionEditorComponent } from './components/code-set-version-editor/code-set-version-editor.component';
import { CoreModule } from '@angular/flex-layout';
import { DamFrameworkModule } from '../dam-framework/dam-framework.module';
import { CodeSetRoutingModule } from './code-set-editor-routing.module';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from './../shared/shared.module';

import { CodeSetEditEffects } from 'src/app/root-store/code-set-editor/code-set-edit/code-set-edit.effects';
import * as fromCodeSet from '../../root-store/code-set-editor/code-set.reducer';
import { DamMessagesModule } from "../dam-framework/dam-framework.module";
import { ReactiveFormsModule } from '@angular/forms';
import { CodeSetActiveTitlebarComponent } from './components/code-set-active-titlebar/code-set-active-titlebar.component';
import { CodeSetSideBarComponent } from './components/code-set-side-bar/code-set-side-bar.component';
import { CodeSetToolBarComponent } from './components/code-set-tool-bar/code-set-tool-bar.component';
import { CodeSetTableComponent } from './components/code-set-table/code-set-table.component';


@NgModule({
    declarations: [CodeSetEditorListComponent, CodeSetEditorCreateComponent, CodeSetEditorComponent, CodeSetVersionEditorComponent, CodeSetActiveTitlebarComponent, CodeSetSideBarComponent, CodeSetToolBarComponent, CodeSetTableComponent],
    imports: [
        DamFrameworkModule.forRoot(),
        CodeSetRoutingModule,
        CoreModule,
        SharedModule,
        EffectsModule.forFeature([CodeSetEditEffects]),
        StoreModule.forFeature(fromCodeSet.featureName, fromCodeSet.reducers),
        DamMessagesModule,
        ReactiveFormsModule,
    ]
})
export class CodeSetEditorModule { }

