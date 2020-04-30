import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MessageType, UserMessage } from '../../dam-framework/models/messages/message.class';
import { AuthenticationService } from '../../dam-framework/services/authentication.service';
import { MessageService } from '../../dam-framework/services/message.service';

@Injectable()
export class NewPasswordResolver implements Resolve<any> {

  constructor(
    private authenticationService: AuthenticationService,
    private store: Store<any>,
    private messageService: MessageService,
    private router: Router) {

  }

  resolve(route: ActivatedRouteSnapshot, rstate: RouterStateSnapshot): Observable<any> {

    return this.authenticationService.validateToken(route.params['token']).pipe(
      catchError((err: any) => {
        this.store.dispatch(this.messageService.userMessageToAction(new UserMessage<any>(MessageType.FAILED, 'Invalid password reset link', undefined, {
          closable: false,
        })));
        this.router.navigate(['/error']);
        return throwError(err);
      }),
    );
  }

}
