import { Type } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import * as fromIgEdit from '../../../root-store/ig/ig-edit/ig-edit.index';
import { EditorID } from '../../shared/models/editor.enum';

export class IgEditorGuardFactory {

  static editorGuard(editor: EditorID): Type<CanActivate> {
    return class implements CanActivate {

      constructor(private store: Store<fromIgEdit.IState>) {}

      canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        console.log(route);
        return of(true);
      }
    };
  }

}
