import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {DatatypesIndexedDbService} from '../indexed-db/datatypes/datatypes-indexed-db.service';

@Injectable()
export class DatatypesService {
    constructor(private http: HttpClient, private datatypesIndexedDbService: DatatypesIndexedDbService) {}

    public getDatatypeStructure(id, callback) {
        const http = this.http;
        this.datatypesIndexedDbService.getDatatypeStructure(id, function(clientDatatypeStructure){
            if (clientDatatypeStructure == null) {
                http.get('api/datatypes/' + id + '/structure').subscribe(serverDatatypeStructure => {
                    callback(serverDatatypeStructure);
                });
            } else {
                callback(clientDatatypeStructure);
            }

        });
    }

    public getDatatypeConformanceStatements(id, callback) {
        const http = this.http;
        const datatypesIndexedDbService = this.datatypesIndexedDbService;

        http.get('api/datatypes/' + id + '/conformanceStatements').subscribe(conformanceStatements => {
            callback(conformanceStatements);
        });

        /*
         this.segmentsIndexedDbService.getSegmentStructure(id, function(clientSegmentStructure){
         if (clientSegmentStructure == null) {
         http.get('api/segments/' + id + '/structure').subscribe(serverSegmentStructure => {
         callback(serverSegmentStructure);
         });
         } else {
         callback(clientSegmentStructure);
         }
         });
         */
    }
}
