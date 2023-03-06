import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { BlockUIModule } from 'ng-block-ui';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './modules/core/core.module';
import { DamRoutingModule } from './modules/dam-framework/dam-framework.module';
import { WorkspaceModule } from './modules/workspace/workspace.module';
import { reducers } from './root-store';
import { ConfigEffects } from './root-store/config/config.effects';
import {LoadedResourcesEffects} from './root-store/dam-igamt/igamt.loaded-resources.effects';
import { ResourceLoaderEffects } from './root-store/resource-loader/resource-loader.effects';
import { UserConfigEffects } from './root-store/user-config/user-config.effects';
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    EffectsModule.forRoot([ConfigEffects, UserConfigEffects,  ResourceLoaderEffects, LoadedResourcesEffects]),
    StoreModule.forRoot(reducers),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
    DamRoutingModule,
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    CoreModule,
    BlockUIModule.forRoot(),
    WorkspaceModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [],
})
export class AppModule {
}
