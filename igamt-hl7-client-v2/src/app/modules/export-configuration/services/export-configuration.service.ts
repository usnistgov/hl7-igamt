import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from '../../dam-framework/models/messages/message.class';
import { IExportConfiguration } from '../../export-configuration/models/default-export-configuration.interface';
import { IExportConfigurationItemList } from '../models/exportConfigurationForFrontEnd.interface';

@Injectable()
export class ExportConfigurationService {

  readonly URL = 'api/configuration';

  constructor(private http: HttpClient) { }

  getExportConfigurationById(id: string): Observable<IExportConfiguration> {
    return this.http.get<IExportConfiguration>(this.URL + '/' + id);
  }

  createExportConfiguration(): Observable<IExportConfiguration> {
    return this.http.get<IExportConfiguration>(this.URL + '/create');
  }

  saveExportConfiguration(exportConfiguration: IExportConfiguration): Observable<Message<any>> {
    return this.http.post<Message<any>>(this.URL + '/save', exportConfiguration);
  }

  saveAsDefaultExportConfiguration(exportConfiguration: IExportConfigurationItemList): Observable<Message<any>> {
    return this.http.post<Message<any>>(this.URL + '/saveAsDefault', exportConfiguration);
  }

  deleteExportConfiguration(exportConfiguration: IExportConfiguration): Observable<Message<any>> {
    return this.http.post<Message<any>>(this.URL + '/delete', exportConfiguration);
  }

  getAllExportConfigurations(): Observable<IExportConfigurationItemList[]> {
    return this.http.get<IExportConfigurationItemList[]>(this.URL + '/generalConfigurations');
  }

}
