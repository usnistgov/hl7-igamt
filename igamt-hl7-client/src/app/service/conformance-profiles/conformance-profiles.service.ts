import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConformanceProfilesIndexedDbService} from '../indexed-db/conformance-profiles/conformance-profiles-indexed-db.service';
import {IObject} from '../indexed-db/objects-database';

@Injectable()
export class ConformanceProfilesService {
  constructor(private http: HttpClient, private conformanceProfilesIndexedDbService: ConformanceProfilesIndexedDbService) {
  }

  public getConformanceProfileMetadata(id): Promise<object> {
    const promise = new Promise<object>((resolve, reject) => {
      this.conformanceProfilesIndexedDbService.getConformanceProfileMetadata(id).then((metadata) => {
        resolve(metadata);
      }).catch(() => {
        this.http.get('api/conformanceProfiles/' + id + '/metadata').subscribe(serverConformanceProfileMetadata => {
          resolve(serverConformanceProfileMetadata);
        }, error => {
          reject(error);
        });
      });
    });
    return promise;
  }

  public getConformanceProfileStructure(id): Promise<object> {
    const promise = new Promise<object>((resolve, reject) => {
      this.conformanceProfilesIndexedDbService.getConformanceProfileStructure(id).then((structure) => {
        resolve(structure);
      }).catch(() => {
        this.http.get('api/conformanceProfiles/' + id + '/structure').subscribe(serverConformanceProfileStructure => {
          resolve(serverConformanceProfileStructure);
        }, error => {
          reject(error);
        });
      });
    });
    return promise;
  }

  public getConformanceProfileCrossReference(id): Promise<object> {
    const promise = new Promise<object>((resolve, reject) => {
      this.conformanceProfilesIndexedDbService.getConformanceProfileCrossReference(id).then((crossReference) => {
        resolve(crossReference);
      }).catch(() => {
        this.http.get('api/conformanceProfiles/' + id + '/crossReference').subscribe(serverConformanceProfileCrossReference => {
          resolve(serverConformanceProfileCrossReference);
        }, error => {
          reject(error);
        });
      });
    });
    return promise;
  }

  public getConformanceProfilePostDef(id): Promise<object> {
    const promise = new Promise<object>((resolve, reject) => {
      this.conformanceProfilesIndexedDbService.getConformanceProfilePostDef(id).then((postDef) => {
        resolve(postDef);
      }).catch(() => {
        this.http.get('api/conformanceProfiles/' + id + '/postDef').subscribe(serverConformanceProfilePostDef => {
          resolve(serverConformanceProfilePostDef);
        }, error => {
          reject(error);
        });
      });
    });
    return promise;
  }

  public getConformanceProfilePreDef(id): Promise<object> {
    const promise = new Promise<object>((resolve, reject) => {
      this.conformanceProfilesIndexedDbService.getConformanceProfilePreDef(id).then((preDef) => {
        resolve(preDef);
      }).catch(() => {
        this.http.get('api/conformanceProfiles/' + id + '/preDef').subscribe(serverConformanceProfilePreDef => {
          resolve(serverConformanceProfilePreDef);
        }, error => {
          reject(error);
        });
      });
    });
    return promise;
  }

  public getConformanceProfileConformanceStatements(id): Promise<object> {
    const promise = new Promise<object>((resolve, reject) => {
      this.conformanceProfilesIndexedDbService.getConformanceProfileConformanceStatements(id).then((conformanceStatement) => {
        resolve(conformanceStatement);
      }).catch(() => {
        this.http.get('api/conformanceProfiles/' + id + '/conformanceStatement').subscribe(serverConformanceProfileConformanceStatement => {
          resolve(serverConformanceProfileConformanceStatement);
        }, error => {
          reject(error);
        });
      });
    });
    return promise;
  }

  public saveConformanceProfileMetadata(id, metadata): Promise<any> {
    const conformanceProfile = new IObject();
    conformanceProfile.id = id;
    conformanceProfile.metadata = metadata;
    return this.conformanceProfilesIndexedDbService.saveConformanceProfile(conformanceProfile);
  }

  public saveConformanceProfileStructure(id, structure): Promise<any> {
    const conformanceProfile = new IObject();
    conformanceProfile.id = id;
    conformanceProfile.structure = structure;
    return this.conformanceProfilesIndexedDbService.saveConformanceProfile(conformanceProfile);
  }

  public saveConformanceProfilePreDef(id, preDef): Promise<any> {
    const conformanceProfile = new IObject();
    conformanceProfile.id = id;
    conformanceProfile.preDef = preDef;
    return this.conformanceProfilesIndexedDbService.saveConformanceProfile(conformanceProfile);
  }

  public saveConformanceProfilePostDef(id, postDef): Promise<any> {
    const conformanceProfile = new IObject();
    conformanceProfile.id = id;
    conformanceProfile.postDef = postDef;
    return this.conformanceProfilesIndexedDbService.saveConformanceProfile(conformanceProfile);
  }

  public saveConformanceProfileCrossReferences(id, crossReference): Promise<any> {
    const conformanceProfile = new IObject();
    conformanceProfile.id = id;
    conformanceProfile.crossReference = crossReference;
    return this.conformanceProfilesIndexedDbService.saveConformanceProfile(conformanceProfile);
  }

  public saveConformanceProfileConformanceStatements(id, conformanceStatements): Promise<any> {
    const conformanceProfile = new IObject();
    conformanceProfile.id = id;
    conformanceProfile.conformanceStatements = conformanceStatements;
    return this.conformanceProfilesIndexedDbService.saveConformanceProfile(conformanceProfile);
  }

}
