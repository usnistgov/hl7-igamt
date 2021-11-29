import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from 'src/app/modules/dam-framework/models/messages/message.class';
import { DAM_AUTH_CONFIG } from '../injection-token';
import { User } from '../models/authentication/user.class';

export interface IAuthenticationURL {
  api: {
    login: string,
    resetPassword: string,
    validateToken: string,
    updatePassword: string,
    checkAuthStatus: string,
    logout: string,
  };
  loginPageRedirectUrl: string;
  unprotectedRedirectUrl: string;
  loginSuccessRedirectUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {

  constructor(
    @Inject(DAM_AUTH_CONFIG) private authConfig: IAuthenticationURL,
    private http: HttpClient) {
  }

  getLoginPageRedirectUrl(): string {
    return this.authConfig.loginPageRedirectUrl;
  }

  getUnprotectedRedirectUrl(): string {
    return this.authConfig.unprotectedRedirectUrl;
  }

  getLoginSuccessRedirectUrl(): string {
    return this.authConfig.loginSuccessRedirectUrl;
  }

  login(username: string, password: string): Observable<Message<User>> {
    return this.http.post<Message<User>>(this.authConfig.api.login, {
      username,
      password,
    });
  }

  requestChangePassword(email: string): Observable<Message<string>> {
    return this.http.post<Message<string>>(this.authConfig.api.resetPassword, email);
  }

  validateToken(token: string): Observable<Message<string>> {
    return this.http.post<Message<string>>(this.authConfig.api.validateToken, token);
  }

  updatePassword(token: string, password: string): Observable<Message<string>> {
    return this.http.post<Message<string>>(this.authConfig.api.updatePassword, { token, password });
  }

  checkAuthStatus(): Observable<User> {
    return this.http.get<User>(this.authConfig.api.checkAuthStatus);
  }

  logout(): Observable<void> {
    return this.http.get<void>(this.authConfig.api.logout);
  }
}
