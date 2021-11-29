import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IAuthenticationState } from '../../../dam-framework/models/authentication/state';
import { IUserProfile } from '../../../dam-framework/models/authentication/user-profile.class';
import * as fromAuth from '../../../dam-framework/store/authentication';

@Component({
  selector: 'app-user-profile-form',
  templateUrl: './user-profile-form.component.html',
  styleUrls: ['./user-profile-form.component.css'],
})
export class UserProfileFormComponent implements OnInit {
  userProfileForm: FormGroup;
  @Output() submitEvent = new EventEmitter<IUserProfile>();
  username: Observable<string>;

  constructor(private store: Store<IAuthenticationState>, private http: HttpClient) {
    this.username = store.select(fromAuth.selectUsername);
    this.userProfileForm = new FormGroup({
      fullName: new FormControl(
        '',
        [
          Validators.required,
        ],
      ),
      email: new FormControl(
        '',
        [
          Validators.email,
          Validators.required,
        ],
      ),
      username: new FormControl(
        '',
        [
          Validators.required,
          Validators.minLength(6),
        ],
      ),
      organization: new FormControl(
        '',
        [
        ],
      ),
    });
  }

  submit() {
    this.submitEvent.emit(this.userProfileForm.getRawValue());
  }

  ngOnInit() {

    this.username.subscribe((uname) => {
      if (uname) {
        this.http.get<any>('api/user/' + uname).subscribe((o) => {
          console.log(o);
          if (o) {
            this.userProfileForm.patchValue({
              username: uname,
              email: o.email,
              fullName: o.fullName,
              organization: o.organization,
            });
          }

        });
      }
    });
  }
}
