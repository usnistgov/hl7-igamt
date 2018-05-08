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
}
