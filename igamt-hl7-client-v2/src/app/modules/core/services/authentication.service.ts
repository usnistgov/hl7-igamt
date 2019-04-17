import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from 'src/app/modules/core/models/message/message.class';
import { User } from '../models/user/user.class';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<Message<User>> {
    return this.http.post<Message<User>>('api/login', {
      username,
      password,
    });
  }

  requestChangePassword(email: string): Observable<Message<string>> {
    return this.http.post<Message<string>>('api/password/reset', email);
  }

  validateToken(token: string): Observable<Message<string>> {
    return this.http.post<Message<string>>('api/password/validatetoken', token);
  }

  updatePassword(token: string, password: string): Observable<Message<string>> {
    return this.http.post<Message<string>>('api/password/reset/confirm', { token, password });
  }

  checkAuthStatus(): Observable<User> {
    return this.http.get<User>('api/authentication');
  }

  logout(): Observable<void> {
    return this.http.get<void>('api/logout');
  }
}
