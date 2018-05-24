import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DatatypesIndexedDbService} from '../indexed-db/datatypes/datatypes-indexed-db.service';
import {IObject} from '../indexed-db/objects-database';

@Injectable()
export class DatatypesService {
  constructor(private http: HttpClient, private datatypesIndexedDbService: DatatypesIndexedDbService) {
  }

  public getDatatypeMetadata(id): Promise<object> {
    const promise = new Promise<object>((resolve, reject) => {
      this.datatypesIndexedDbService.getDatatypeMetadata(id).then((metadata) => {
        resolve(metadata);
      }).catch(() => {
        this.http.get('api/datatypes/' + id + '/metadata').subscribe(serverDatatypeMetadata => {
          resolve(serverDatatypeMetadata);
        }, error => {
          reject(error);
        });
      });
    });
    return promise;
  }

  public getDatatypeStructure(id): Promise<object> {
    const promise = new Promise<object>((resolve, reject) => {
      this.datatypesIndexedDbService.getDatatypeStructure(id).then((structure) => {
        resolve(structure);
      }).catch(() => {
        this.http.get('api/datatypes/' + id + '/structure').subscribe(serverDatatypeStructure => {
          resolve(serverDatatypeStructure);
        }, error => {
          reject(error);
        });
      });
    });
    return promise;
  }

  public getDatatypeCrossReference(id): Promise<object> {
    const promise = new Promise<object>((resolve, reject) => {
      this.datatypesIndexedDbService.getDatatypeCrossReference(id).then((crossReference) => {
        resolve(crossReference);
      }).catch(() => {
        this.http.get('api/datatypes/' + id + '/crossReference').subscribe(serverDatatypeCrossReference => {
          resolve(serverDatatypeCrossReference);
        }, error => {
          reject(error);
        });
      });
    });
    return promise;
  }

  public getDatatypePostDef(id): Promise<object> {
    const promise = new Promise<object>((resolve, reject) => {
      this.datatypesIndexedDbService.getDatatypePostDef(id).then((postDef) => {
        resolve(postDef);
      }).catch(() => {
        this.http.get('api/datatypes/' + id + '/postDef').subscribe(serverDatatypePostDef => {
          resolve(serverDatatypePostDef);
        }, error => {
          reject(error);
        });
      });
    });
    return promise;
  }

  public getDatatypePreDef(id): Promise<object> {
    const promise = new Promise<object>((resolve, reject) => {
      this.datatypesIndexedDbService.getDatatypePreDef(id).then((preDef) => {
        resolve(preDef);
      }).catch(() => {
        this.http.get('api/datatypes/' + id + '/preDef').subscribe(serverDatatypePreDef => {
          resolve(serverDatatypePreDef);
        }, error => {
          reject(error);
        });
      });
    });
    return promise;
  }

  public getDatatypeConformanceStatements(id): Promise<object> {
    const promise = new Promise<object>((resolve, reject) => {
      this.datatypesIndexedDbService.getDatatypeConformanceStatements(id).then((conformanceStatement) => {
        resolve(conformanceStatement);
      }).catch(() => {
        this.http.get('api/datatypes/' + id + '/conformanceStatement').subscribe(serverDatatypeConformanceStatement => {
          resolve(serverDatatypeConformanceStatement);
        }, error => {
          reject(error);
        });
      });
    });
    return promise;
  }

  public saveDatatypeMetadata(id, metadata): Promise<any> {
    const datatype = new IObject();
    datatype.id = id;
    datatype.metadata = metadata;
    return this.datatypesIndexedDbService.saveDatatype(datatype);
  }

  public saveDatatypeStructure(id, structure): Promise<any> {
    const datatype = new IObject();
    datatype.id = id;
    datatype.structure = structure;
    return this.datatypesIndexedDbService.saveDatatype(datatype);
  }

  public saveDatatypePreDef(id, preDef): Promise<any> {
    const datatype = new IObject();
    datatype.id = id;
    datatype.preDef = preDef;
    return this.datatypesIndexedDbService.saveDatatype(datatype);
  }

  public saveDatatypePostDef(id, postDef): Promise<any> {
    const datatype = new IObject();
    datatype.id = id;
    datatype.postDef = postDef;
    return this.datatypesIndexedDbService.saveDatatype(datatype);
  }

  public saveDatatypeCrossReferences(id, crossReference): Promise<any> {
    const datatype = new IObject();
    datatype.id = id;
    datatype.crossReference = crossReference;
    return this.datatypesIndexedDbService.saveDatatype(datatype);
  }

  public saveDatatypeConformanceStatements(id, conformanceStatements): Promise<any> {
    const datatype = new IObject();
    datatype.id = id;
    datatype.conformanceStatements = conformanceStatements;
    return this.datatypesIndexedDbService.saveDatatype(datatype);
  }

}
