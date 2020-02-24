import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable, of} from 'rxjs';
import {DocumentationEditorComponent} from '../components/documentation-editor/documentation-editor.component';

@Injectable({
  providedIn: 'root',
})
export class CanDeactivateDocumentationGuard implements CanDeactivate<DocumentationEditorComponent> {

  canDeactivate(component: DocumentationEditorComponent, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): Observable<boolean>  {

    console.log('Called deactivate');
    return of(true);
  }
}
