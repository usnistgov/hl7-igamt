import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable, of} from 'rxjs';
import {Type} from '../constants/type.enum';
import {ISlicing} from '../models/slicing';

@Injectable({
  providedIn: 'root',
})
export class SlicingService {

  constructor(private http: HttpClient, private store: Store<any>) { }

  getResoureSlicing = (type: Type, id: string): Observable<ISlicing[]> => {
    return of([]);
  }}
