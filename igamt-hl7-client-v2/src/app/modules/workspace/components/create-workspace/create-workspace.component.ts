import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import * as fromDAM from 'src/app/modules/dam-framework/store/index';
import { MessageService } from '../../../dam-framework/services/message.service';
import { WorkspaceService } from './../../services/workspace.service';

@Component({
  selector: 'app-create-workspace',
  templateUrl: './create-workspace.component.html',
  styleUrls: ['./create-workspace.component.scss'],
})
export class CreateWorkspaceComponent implements OnInit {

  metaDataForm: FormGroup;

  constructor(
    private store: Store<any>,
    private workspaceService: WorkspaceService,
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
    this.workspaceService.createWorkspace(this.metaDataForm.getRawValue()).pipe(
      tap((message) => {
        this.store.dispatch(this.messageService.messageToAction(message));
        this.router.navigate(['/workspace/' + message.data]);
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
