import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { LibraryEffects } from '../../root-store/library/library.effects';
import * as fromLibrary from '../../root-store/library/library.reducer';
import { CoreModule } from '../core/core.module';
import { DamFrameworkModule } from '../dam-framework/dam-framework.module';
import { SharedModule } from '../shared/shared.module';
import { LibraryContainerComponent } from './components/library-container/library-container.component';
import { DatatypeLibraryRoutingModule } from './datatype-library-routing.module';

@NgModule({
  declarations: [LibraryContainerComponent],
  imports: [
    CommonModule,
    DamFrameworkModule,
    DatatypeLibraryRoutingModule,
    // EffectsModule.forFeature([IgListEffects, CreateIgEffects, IgEditEffects]),
    // StoreModule.forFeature(fromIg.featureName, fromIg.reducers),
    CoreModule,
    SharedModule,
    StoreModule.forFeature('library', fromLibrary.reducer),
    EffectsModule.forFeature([LibraryEffects]),
    // StepsModule,
    // RadioButtonModule,
    // TableModule,
    // ColorPickerModule,
    // ContextMenuModule,
    // ExportConfigurationModule,
  ],
})
export class DatatypeLibraryModule { }
