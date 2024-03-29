import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Message } from '../../dam-framework/models/messages/message.class';
import { Hl7Config, IValueSetBindingConfigMap } from '../models/config.class';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {

  constructor(private http: HttpClient) {
  }

  getConfig(): Observable<Message<Hl7Config>> {
    return this.http.get<Message<Hl7Config>>('api/config/');
  }

}
