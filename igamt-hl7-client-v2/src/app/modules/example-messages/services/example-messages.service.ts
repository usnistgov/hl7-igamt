import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IExampleMessageDTO, IgExampleMessages } from '../domain/example-messages.model';
import { IMessage } from '../../dam-framework/models/messages/message.class';

export interface ICreateExampleMessageSnippetRequest {
  name: string;
  messageReferences: string[];
}

export interface ISnippetRenderResult {
  snippetId: string;
  snippetName: string;
  snippetDescription: string;
  messageId: string;
  messageName: string;
  fullMessage: string;
  renderedContent: string;
  parts: ISnippetPart[];
  snippetNotFound: boolean;
  warnings: string[];
}

export interface ISnippetPart {
  positionalPath: string;
  hl7Path: string;
  elementName: string;
  elementType: string;
  content: string;
  startLine: number;
  endLine: number;
  highlightStart: { line: number; column: number };
  highlightEnd: { line: number; column: number };
}

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

  public saveExampleMessage(id: string, messageId: string, data: { message: string, narrative: string, name?: string, description?: string }): Observable<IMessage<IExampleMessageDTO>> {
    return this.http.post<IMessage<IExampleMessageDTO>>(`api/example-messages/${id}/message/${messageId}`, data);
  }

  public parseExampleMessage(id: string, messageId: string): Observable<any[]> {
    return this.http.get<any[]>(`api/example-messages/${id}/message/${messageId}/parse`);
  }

  public createExampleMessageSnippet(id: string, messageId: string, data: ICreateExampleMessageSnippetRequest): Observable<IMessage<IgExampleMessages>> {
    return this.http.post<IMessage<IgExampleMessages>>(`api/example-messages/${id}/message/${messageId}/snippet`, data);
  }

  public renderSnippet(igId: string, messageId: string, snippetId: string): Observable<ISnippetRenderResult> {
    return this.http.get<ISnippetRenderResult>(`api/example-messages/${igId}/message/${messageId}/snippet/${snippetId}/render`);
  }

  public renderFromPaths(igId: string, messageId: string, positionalPaths: string[]): Observable<ISnippetRenderResult> {
    return this.http.post<ISnippetRenderResult>(`api/example-messages/${igId}/message/${messageId}/render`, { positionalPaths });
  }

  public saveSnippet(igId: string, messageId: string, snippetId: string, data: { name: string, description: string }): Observable<IMessage<any>> {
    return this.http.post<IMessage<any>>(`api/example-messages/${igId}/message/${messageId}/snippet/${snippetId}`, data);
  }

}
