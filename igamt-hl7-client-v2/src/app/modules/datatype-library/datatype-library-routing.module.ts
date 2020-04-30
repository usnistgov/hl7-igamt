import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LibraryActionTypes, LoadLibrary } from '../../root-store/library/library.actions';
import { ErrorPageComponent } from '../core/components/error-page/error-page.component';
import { DataLoaderGuard } from '../dam-framework/guards/data-loader.guard';
import { LibraryContainerComponent } from './components/library-container/library-container.component';

const routes: Routes = [
  {
    path: 'error',
    component: ErrorPageComponent,
  },
  {
    path: ':libraryId',
    component: LibraryContainerComponent,
    data: {
      routeParam: 'libraryId',
      loadAction: LoadLibrary,
      successAction: LibraryActionTypes.LoadLibrarySuccess,
      failureAction: LibraryActionTypes.LoadLibraryFailure,
      redirectTo: ['library', 'error'],
    },
    canActivate: [DataLoaderGuard],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class DatatypeLibraryRoutingModule {
}
