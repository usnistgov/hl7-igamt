import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IRegistration } from '../../dam-framework/models/authentication/registration.class';
import { User } from '../../dam-framework/models/authentication/user.class';
import { Message } from '../../dam-framework/models/messages/message.class';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {

  constructor(private http: HttpClient) {
  }

  register(registrationRequest: IRegistration): Observable<Message<User>> {
    return this.http.post<Message<User>>('api/register', registrationRequest);
  }
}
