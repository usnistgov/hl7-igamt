import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {SegmentsIndexedDbService} from '../indexed-db/segments/segments-indexed-db.service';

@Injectable()
export class SegmentsService {
  constructor(private http: HttpClient, private segmentsIndexedDbService: SegmentsIndexedDbService) {}
  public getSegmentMetadata(id, callback) {
    const http = this.http;
    this.segmentsIndexedDbService.getSegmentMetadata(id, function(clientSegmentMetadata){
      if (clientSegmentMetadata == null) {
        http.get('api/segments/' + id + '/metadata').subscribe(serverSegmentMetadata => {
          callback(serverSegmentMetadata);
        });
      } else {
        callback(clientSegmentMetadata);
      }
    });
  }

  public getSegmentStructure(id, callback) {
    const http = this.http;
    const segmentsIndexedDbService = this.segmentsIndexedDbService;
    this.segmentsIndexedDbService.getSegmentStructure(id, function(clientSegmentStructure){
      console.log(clientSegmentStructure);
      if (clientSegmentStructure == null) {
        http.get('api/segments/' + id + '/structure').subscribe(serverSegmentStructure => {
          segmentsIndexedDbService.saveSegmentStructureToNodeDatabase(id, serverSegmentStructure);
          callback(serverSegmentStructure);
        });
      } else {
        callback(clientSegmentStructure);
      }
    });
  }

  public getSegmentPreDef(id, callback) {
    const http = this.http;
    this.segmentsIndexedDbService.getSegmentPreDef(id, function(clientSegmentPreDef){
      if (clientSegmentPreDef == null) {
        http.get('api/segments/' + id + '/preDef').subscribe(serverSegmentPreDef => {
          callback(serverSegmentPreDef);
        });
      } else {
        callback(clientSegmentPreDef);
      }
    });
  }

  public getSegmentPostDef(id, callback) {
    const http = this.http;
    this.segmentsIndexedDbService.getSegmentPostDef(id, function(clientSegmentPostDef){
      if (clientSegmentPostDef == null) {
        http.get('api/segments/' + id + '/postDef').subscribe(serverSegmentPostDef => {
          callback(serverSegmentPostDef);
        });
      } else {
        callback(clientSegmentPostDef);
      }
    });
  }

  public getSegmentCrossReferences(id, callback) {
    this.segmentsIndexedDbService.getSegmentCrossReference(id, function(clientSegmentMetadata){
      if (clientSegmentMetadata == null) {
        this.http.get('api/segments/' + id + '/crossReferences').then(function(serverSegmentMetadata){
          callback(serverSegmentMetadata);
        });
      } else {
        callback(clientSegmentMetadata);
      }
    });
  }
}
