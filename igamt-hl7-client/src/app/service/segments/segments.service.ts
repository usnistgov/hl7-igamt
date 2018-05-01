import {Injectable} from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {SegmentsIndexedDbService} from '../indexed-db/segments/segments-indexed-db.service';

@Injectable()
export class SegmentsService {
  constructor(private http: HttpClientModule, private segmentsIndexedDbService: SegmentsIndexedDbService) {}
  public getSegmentMetadata(id, callback) {
    this.segmentsIndexedDbService.getSegmentMetadata(id, function(clientSegmentMetadata){
      if (clientSegmentMetadata == null) {
        this.http.get('api/segments/' + id + '/metadata').then(function(serverSegmentMetadata){
          callback(serverSegmentMetadata);
        });
      } else {
        callback(clientSegmentMetadata);
      }
    });
  }
  public getSegmentDefinition(id, callback) {
    this.segmentsIndexedDbService.getSegmentDefinition(id, function(clientSegmentMetadata){
      if (clientSegmentMetadata == null) {
        this.http.get('api/segments/' + id + '/definition').then(function(serverSegmentMetadata){
          callback(serverSegmentMetadata);
        });
      } else {
        callback(clientSegmentMetadata);
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
