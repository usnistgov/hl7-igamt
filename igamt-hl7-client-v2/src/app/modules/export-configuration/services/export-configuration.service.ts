import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Message } from '../../core/models/message/message.class';
import { IStructureElementBinding } from '../../shared/models/binding.interface';
import { IConformanceStatementList } from '../../shared/models/cs-list.interface';
import { IChange } from '../../shared/models/save-change';
import { ISegment } from '../../shared/models/segment.interface';
import { ValueSetService } from '../../value-set/service/value-set.service';
import { IExportConfiguration } from '../../export-configuration/models/default-export-configuration.interface';


@Injectable()
export class ExportConfigurationService {

  readonly URL = 'api/configuration';
  exportConfigurationForFrontEnd :any;

  constructor(private http: HttpClient) { }

  getExportConfigurationById(id: string): Observable<IExportConfiguration> {
    return this.http.get<IExportConfiguration>(this.URL +"/"+ id);
  }

  createExportConfiguration(): Observable<IExportConfiguration> {
    return this.http.get<IExportConfiguration>(this.URL + '/create');
  }

  saveExportConfiguration(exportConfiguration : IExportConfiguration): Observable<IExportConfiguration> {
    return this.http.post<IExportConfiguration>(this.URL + '/save', exportConfiguration);
  }

  deleteExportConfiguration(exportConfiguration : IExportConfiguration): Observable<IExportConfiguration> {
    return this.http.post<IExportConfiguration>(this.URL + '/delete', exportConfiguration);
  }

  getAllExportConfigurationByUsername(): Observable<Array<any>> {
    return this.http.get<Array<any>>(this.URL + '/generalConfigurations');
  }


}
