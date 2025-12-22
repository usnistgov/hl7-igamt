import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IExampleMessageDTO, IgExampleMessages } from '../domain/example-messages.model';
import { IMessage } from '../../dam-framework/models/messages/message.class';

@Injectable({
  providedIn: 'root',
})
export class ExampleMessagesService {

  constructor(private http: HttpClient) { }

  public getIgExampleMessages(id: string): Observable<IgExampleMessages> {
    return this.http.get<IgExampleMessages>(`api/example-messages/${id}`);
  }

  public getExampleMessage(id: string, messageId: string): Observable<IExampleMessageDTO> {
    return this.http.get<IExampleMessageDTO>(`api/example-messages/${id}/message/${messageId}`);
  }

  public createExampleMessage(id: string, data: { name: string, profileId: string }): Observable<IMessage<IgExampleMessages>> {
    return this.http.post<IMessage<IgExampleMessages>>(`api/example-messages/${id}/message`, data);
  }

  public saveExampleMessage(id: string, messageId: string, data: { message: string, narrative: string }): Observable<IMessage<IExampleMessageDTO>> {
    console.log('data', data);
    return this.http.post<IMessage<IExampleMessageDTO>>(`api/example-messages/${id}/message/${messageId}`, data);
  }

  public parseExampleMessage(id: string, messageId: string): Observable<any[]> {
    return this.http.get<any[]>(`api/example-messages/${id}/message/${messageId}/parse`);
  }

}
