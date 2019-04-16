import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LocationStrategy} from  '@angular/common';

@Injectable()
export class LibraryExportService {

  constructor(private http: HttpClient, private location: LocationStrategy) {


  }

  exportAsWord(igId) {
    console.log('Exporting');
    window.open(this.prepareUrl(igId, 'word'));
  }

  exportAsHtml(igId) {
    window.open(this.prepareUrl(igId, 'html'));
  }
  exportAsWeb(igId) {
    window.open(this.prepareUrlForWeb(igId, 'web'));
  }

  private prepareUrl(igId: string, type: string): string {
    return this.location.prepareExternalUrl('api/datatype-library/' + igId + '/export/' + type).replace('#', '');
  }

  private prepareUrlForWeb(igId: string, type: string): string {
    return this.location.prepareExternalUrl('api/web-export/' + igId + '/export/' + type).replace('#', '');
  }
}
