import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from '../models/message/message.class';
import { IRegistration } from '../models/user/registration.class';
import { User } from '../models/user/user.class';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {

  constructor(private http: HttpClient) { }

  register(registrationRequest: IRegistration): Observable<Message<User>> {
    return this.http.post<Message<User>>('api/register', registrationRequest);
  }
}
