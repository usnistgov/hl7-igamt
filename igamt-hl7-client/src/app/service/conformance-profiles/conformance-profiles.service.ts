import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ConformanceProfilesIndexedDbService} from '../indexed-db/conformance-profiles/conformance-profiles-indexed-db.service';

@Injectable()
export class ConformanceProfilesService {
  constructor(private http: HttpClient, private conformanceProfilesIndexedDbService: ConformanceProfilesIndexedDbService) {}
  public getConformanceProfileMetadata(id, callback) {
    const http = this.http;
    this.conformanceProfilesIndexedDbService.getConformanceProfileMetadata(id, function(clientConformanceProfileMetadata){
      if (clientConformanceProfileMetadata == null) {
        http.get('api/conformanceProfiles/' + id + '/metadata').subscribe(serverConformanceProfileMetadata => {
          callback(serverConformanceProfileMetadata);
        });
      } else {
        callback(clientConformanceProfileMetadata);
      }
    });
  }

  public getConformanceProfileStructure(id, callback) {
    const http = this.http;
    const conformanceProfilesIndexedDbService = this.conformanceProfilesIndexedDbService;
    this.conformanceProfilesIndexedDbService.getConformanceProfileStructure(id, function(clientConformanceProfileStructure){
      console.log(clientConformanceProfileStructure);
      if (clientConformanceProfileStructure == null) {
        http.get('api/conformanceProfiles/' + id + '/structure').subscribe(serverConformanceProfileStructure => {
          callback(serverConformanceProfileStructure);
        });
      } else {
        callback(clientConformanceProfileStructure);
      }
    });
  }

  public getConformanceProfilePreDef(id, callback) {
    const http = this.http;
    this.conformanceProfilesIndexedDbService.getConformanceProfilePreDef(id, function(clientConformanceProfilePreDef){
      if (clientConformanceProfilePreDef == null) {
        http.get('api/conformanceProfiles/' + id + '/preDef').subscribe(serverConformanceProfilePreDef => {
          callback(serverConformanceProfilePreDef);
        });
      } else {
        callback(clientConformanceProfilePreDef);
      }
    });
  }

  public getConformanceProfilePostDef(id, callback) {
    const http = this.http;
    this.conformanceProfilesIndexedDbService.getConformanceProfilePostDef(id, function(clientConformanceProfilePostDef){
      if (clientConformanceProfilePostDef == null) {
        http.get('api/conformanceProfiles/' + id + '/postDef').subscribe(serverConformanceProfilePostDef => {
          callback(serverConformanceProfilePostDef);
        });
      } else {
        callback(clientConformanceProfilePostDef);
      }
    });
  }

  public getConformanceProfileCrossReferences(id, callback) {
    this.conformanceProfilesIndexedDbService.getConformanceProfileCrossReference(id, function(clientConformanceProfileMetadata){
      if (clientConformanceProfileMetadata == null) {
        this.http.get('api/conformanceProfiles/' + id + '/crossReferences').then(function(serverConformanceProfileMetadata){
          callback(serverConformanceProfileMetadata);
        });
      } else {
        callback(clientConformanceProfileMetadata);
      }
    });
  }
}
