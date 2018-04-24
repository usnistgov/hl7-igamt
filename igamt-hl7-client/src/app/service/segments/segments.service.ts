import {Injectable} from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { IndexedDbService } from '../indexed-db/indexed-db.service';

@Injectable()
export class SegmentsService {
  constructor(private http: HttpClientModule, private indexedDbService: IndexedDbService) {}
  public getSegmentMetadata(id, callback) {
    this.indexedDbService.getSegmentMetadata(id, function(clientSegmentMetadata){
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
