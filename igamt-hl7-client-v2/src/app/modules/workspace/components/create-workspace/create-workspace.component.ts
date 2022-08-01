import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { map, tap, catchError } from 'rxjs/operators';
import { WorkspaceService } from './../../services/workspace.service';
import { WorkspaceAccessType, IWorkspace } from './../../models/models';
import { Store } from '@ngrx/store';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import * as fromDAM from 'src/app/modules/dam-framework/store/index';
import { of } from 'rxjs';

@Component({
  selector: 'app-create-workspace',
  templateUrl: './create-workspace.component.html',
  styleUrls: ['./create-workspace.component.scss']
})
export class CreateWorkspaceComponent implements OnInit {

  metaDataForm: FormGroup;

  workspaceType: WorkspaceAccessType;



  constructor(private store: Store<any>, private workspaceService: WorkspaceService, private router: Router) {
    this.workspaceType =  WorkspaceAccessType.PRIVATE;
    this.metaDataForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', []),
    });
  }

  ngOnInit() {

  }


  submit() {

    let workspace: IWorkspace = {
      accessType: this.workspaceType,
      id: null,
      metadata: {title: this.metaDataForm.getRawValue()['title'], description:this.metaDataForm.getRawValue()['description'] },
      documents: [],
      folders: []
    }
    this.store.dispatch(new fromDAM.TurnOnLoader({
      blockUI: false,
    }));
    const subs = this.workspaceService.createWorkspace(workspace).pipe(
      tap((resp: IWorkspace) => {
        this.router.navigate(['/workspace/' + resp.id]);
        // TODDO add sucess Message
        this.store.dispatch(new fromDAM.TurnOffLoader());

      })
      , catchError(
        (err: HttpErrorResponse) => {
          console.log(err);
                  // TODDO add ERROR Message

          this.store.dispatch(new fromDAM.TurnOffLoader());

          return of(err);
        })
      ,
    ).subscribe();
  }

}
