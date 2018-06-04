/**
 * Created by ena3 on 3/5/18.
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, BehaviorSubject} from "rxjs";


@Injectable()
export class UserService {
  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<any[]>('api/users');
  }

  getById(id: number) {
    return this.http.get('api/users/' + id);
  }

  create(user: any)  {
    return  this.http.post('api/register', user, { observe: 'response' });



  }

  update(user: any) {
    return this.http.put('api/users/' + user.id, user);
  }

  delete(id: number) {
    return this.http.delete('api/users/' + id);
  }
}
