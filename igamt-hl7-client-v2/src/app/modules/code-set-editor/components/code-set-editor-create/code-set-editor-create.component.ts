import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import * as fromDAM from 'src/app/modules/dam-framework/store/index';
import { MessageService } from '../../../dam-framework/services/message.service';
import { CodeSetServiceService } from '../../services/CodeSetService.service';

@Component({
  selector: 'app-code-set-editor-create',
  templateUrl: './code-set-editor-create.component.html',
  styleUrls: ['./code-set-editor-create.component.css'],
})
export class CodeSetEditorCreateComponent implements OnInit {

  metaDataForm: FormGroup;

  constructor(
    private store: Store<any>,
    private codeSetService: CodeSetServiceService,
    private messageService: MessageService,
    private router: Router,
  ) {
    this.metaDataForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', []),
    });
  }

  ngOnInit() {

  }

  submit() {
    this.store.dispatch(new fromDAM.TurnOnLoader({
      blockUI: false,
    }));
    this.codeSetService.createCodeSet(this.metaDataForm.getRawValue()).pipe(
      tap((message) => {
        this.store.dispatch(this.messageService.messageToAction(message));
        this.router.navigate(['/code-set/' + message.data]);
        this.store.dispatch(new fromDAM.TurnOffLoader());
      }),
      catchError((err) => {
        this.store.dispatch(this.messageService.actionFromError(err));
        this.store.dispatch(new fromDAM.TurnOffLoader());
        return of(err);
      }),
    ).subscribe();
  }

}
