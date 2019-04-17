import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { ToastOptions, ToastyService } from 'ng2-toasty';
import { tap } from 'rxjs/operators';
import { MessageType } from 'src/app/modules/core/models/message/message.class';
import { MessageService } from 'src/app/modules/core/services/message.service';
import { NotificationActions, NotificationActionTypes } from './notification.actions';

@Injectable()
export class NotificationEffects {

  @Effect({
    dispatch: false,
  })
  notify$ = this.actions$.pipe(
    ofType(NotificationActionTypes.Notify),
    tap((action) => {
      const toastOptions: ToastOptions = {
        title: '',
        msg: action.payload.message,
        showClose: action.payload.options.closable,
        timeout: action.payload.options.timeout,
        theme: 'default',
      };

      switch (action.payload.status) {
        case MessageType.INFO:
          this.toastyService.info(toastOptions);
          break;
        case MessageType.SUCCESS:
          this.toastyService.success(toastOptions);
          break;
        case MessageType.FAILED:
          this.toastyService.error(toastOptions);
          break;
        case MessageType.WARNING:
          this.toastyService.warning(toastOptions);
          break;
        default:
          this.toastyService.default(toastOptions);
      }
    }),
  );

  constructor(
    private actions$: Actions<NotificationActions>,
    private messageService: MessageService,
    private toastyService: ToastyService,
  ) { }

}

export type NotificationSeverity = 'success' | 'info' | 'warn' | 'error';
