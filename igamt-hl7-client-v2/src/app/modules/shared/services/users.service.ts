import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UsersService {
    constructor(private http: HttpClient) { }

    getUsernames(): Observable<string[]> {
        return this.http.get<string[]>('api/usernames');
    }
}
