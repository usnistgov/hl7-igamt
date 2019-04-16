import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LocationStrategy} from  '@angular/common';

@Injectable()
export class ExportService {

  constructor(private http: HttpClient, private location: LocationStrategy) {


  }

  exportAsWord(igId) {
    console.log('Exporting');
    window.open(this.prepareUrl(igId, 'word'));
    // return  this.http.get<any>('api/igdocuments/' + igId + '/export/word');
  }

  exportAsHtml(igId) {
    window.open(this.prepareUrl(igId, 'html'));
    // return  this.http.get<any>(this.getBaseUrl() + 'api/igdocuments/' + igId + '/export/html');
  }

  private prepareUrl(igId: string, type: string): string {
    return this.location.prepareExternalUrl('api/igdocuments/' + igId + '/export/' + type).replace('#', '');
  }

}
