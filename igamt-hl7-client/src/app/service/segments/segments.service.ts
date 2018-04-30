import {Injectable} from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { IndexedDbService } from '../indexed-db/indexed-db.service';
import {SegmentsIndexedDbService} from '../indexed-db/segments/segments-indexed-db.service';

@Injectable()
export class SegmentsService {
  constructor(private http: HttpClientModule, private segmentsIndexedDbService: SegmentsIndexedDbService) {}
  public getSegmentMetadata(id, callback) {
    this.segmentsIndexedDbService.getSegmentMetadata(id, function(clientSegmentMetadata){
      if (clientSegmentMetadata.isUndefined()) {
        this.http.get('api/segments/' + id + '/metadata').then(function(serverSegmentMetadata){
          callback(serverSegmentMetadata);
        });
      } else {
        callback(clientSegmentMetadata);
      }
    });
  }
}
