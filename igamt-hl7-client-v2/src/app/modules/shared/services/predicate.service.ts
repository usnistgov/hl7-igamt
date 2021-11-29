import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {Type} from '../constants/type.enum';
import { IDocumentRef } from '../models/abstract-domain.interface';
import { IPredicate } from '../models/predicate.interface';

@Injectable({
  providedIn: 'root',
})
export class PredicateService {

  constructor(private http: HttpClient) { }
}
