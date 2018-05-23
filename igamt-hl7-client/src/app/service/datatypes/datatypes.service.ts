import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {DatatypesIndexedDbService} from '../indexed-db/datatypes/datatypes-indexed-db.service';

@Injectable()
export class DatatypesService {
    constructor(private http: HttpClient, private datatypesIndexedDbService: DatatypesIndexedDbService) {}
    public getDatatypeMetadata(id, callback) {
        const http = this.http;
        this.datatypesIndexedDbService.getDatatypeMetadata(id, function(clientDatatypeMetadata){
            if (clientDatatypeMetadata == null) {
                http.get('api/datatypes/' + id + '/metadata').subscribe(serverDatatypeMetadata => {
                    callback(serverDatatypeMetadata);
                });
            } else {
                callback(clientDatatypeMetadata);
            }
        });
    }

    public getDatatypeStructure(id, callback) {
        const http = this.http;
        const datatypesIndexedDbService = this.datatypesIndexedDbService;
        this.datatypesIndexedDbService.getDatatypeStructure(id, function(clientDatatypeStructure){
            if (clientDatatypeStructure == null) {
                http.get('api/datatypes/' + id + '/structure').subscribe(serverDatatypeStructure => {
                    datatypesIndexedDbService.saveDatatypeStructureToNodeDatabase(id, serverDatatypeStructure);
                    callback(serverDatatypeStructure);
                });
            } else {
                callback(clientDatatypeStructure);
            }
        });
    }

    public getDatatypeConformanceStatements(id, callback) {
        const http = this.http;
        this.datatypesIndexedDbService.getDatatypeConformanceStatements(id, function(clientDatatypeConformanceStatements){
            if (clientDatatypeConformanceStatements == null) {
                http.get('api/datatypes/' + id + '/conformancestatement').subscribe(serverDatatypeConformanceStatements => {
                    callback(serverDatatypeConformanceStatements);
                });
            } else {
                callback(clientDatatypeConformanceStatements);
            }
        });
    }

    public getDatatypePreDef(id, callback) {
        const http = this.http;
        this.datatypesIndexedDbService.getDatatypePreDef(id, function(clientDatatypePreDef){
            if (clientDatatypePreDef == null) {
                http.get('api/datatypes/' + id + '/preDef').subscribe(serverDatatypePreDef => {
                    callback(serverDatatypePreDef);
                });
            } else {
                callback(clientDatatypePreDef);
            }
        });
    }

    public getDatatypePostDef(id, callback) {
        const http = this.http;
        this.datatypesIndexedDbService.getDatatypePostDef(id, function(clientDatatypePostDef){
            if (clientDatatypePostDef == null) {
                http.get('api/datatypes/' + id + '/postDef').subscribe(serverDatatypePostDef => {
                    callback(serverDatatypePostDef);
                });
            } else {
                callback(clientDatatypePostDef);
            }
        });
    }

}
