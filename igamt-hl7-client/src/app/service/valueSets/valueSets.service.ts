import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ValuesetsIndexedDbService} from '../indexed-db/valuesets/valuesets-indexed-db.service';
import {IObject} from '../indexed-db/objects-database';

@Injectable()
export class ValuesetsService {
  constructor(private http: HttpClient, private valuesetsIndexedDbService: ValuesetsIndexedDbService) {
  }

  public getValuesetMetadata(id): Promise<object> {
    const promise = new Promise<object>((resolve, reject) => {
      this.valuesetsIndexedDbService.getValuesetMetadata(id).then((metadata) => {
        resolve(metadata);
      }).catch(() => {
        this.http.get('api/valuesets/' + id + '/metadata').subscribe(serverValuesetMetadata => {
          resolve(serverValuesetMetadata);
        }, error => {
          reject(error);
        });
      });
    });
    return promise;
  }

  public getValuesetStructure(id): Promise<object> {
    const promise = new Promise<object>((resolve, reject) => {
      this.valuesetsIndexedDbService.getValuesetStructure(id).then((structure) => {
        resolve(structure);
      }).catch(() => {
        this.http.get('api/valuesets/' + id + '/structure').subscribe(serverValuesetStructure => {
          resolve(serverValuesetStructure);
        }, error => {
          reject(error);
        });
      });
    });
    return promise;
  }

  public getValuesetCrossReference(id): Promise<object> {
    const promise = new Promise<object>((resolve, reject) => {
      this.valuesetsIndexedDbService.getValuesetCrossReference(id).then((crossReference) => {
        resolve(crossReference);
      }).catch(() => {
        this.http.get('api/valuesets/' + id + '/crossReference').subscribe(serverValuesetCrossReference => {
          resolve(serverValuesetCrossReference);
        }, error => {
          reject(error);
        });
      });
    });
    return promise;
  }

  public getValuesetPostDef(id): Promise<object> {
    const promise = new Promise<object>((resolve, reject) => {
      this.valuesetsIndexedDbService.getValuesetPostDef(id).then((postDef) => {
        resolve(postDef);
      }).catch(() => {
        this.http.get('api/valuesets/' + id + '/postDef').subscribe(serverValuesetPostDef => {
          resolve(serverValuesetPostDef);
        }, error => {
          reject(error);
        });
      });
    });
    return promise;
  }

  public getValuesetPreDef(id): Promise<object> {
    const promise = new Promise<object>((resolve, reject) => {
      this.valuesetsIndexedDbService.getValuesetPreDef(id).then((preDef) => {
        resolve(preDef);
      }).catch(() => {
        this.http.get('api/valuesets/' + id + '/preDef').subscribe(serverValuesetPreDef => {
          resolve(serverValuesetPreDef);
        }, error => {
          reject(error);
        });
      });
    });
    return promise;
  }

  public getValuesetConformanceStatements(id): Promise<object> {
    const promise = new Promise<object>((resolve, reject) => {
      this.valuesetsIndexedDbService.getValuesetConformanceStatements(id).then((conformanceStatement) => {
        resolve(conformanceStatement);
      }).catch(() => {
        this.http.get('api/valuesets/' + id + '/conformanceStatement').subscribe(serverValuesetConformanceStatement => {
          resolve(serverValuesetConformanceStatement);
        }, error => {
          reject(error);
        });
      });
    });
    return promise;
  }

  public saveValuesetMetadata(id, metadata): Promise<any> {
    const valueset = new IObject();
    valueset.id = id;
    valueset.metadata = metadata;
    return this.valuesetsIndexedDbService.saveValueset(valueset);
  }

  public saveValuesetStructure(id, structure): Promise<any> {
    const valueset = new IObject();
    valueset.id = id;
    valueset.structure = structure;
    return this.valuesetsIndexedDbService.saveValueset(valueset);
  }

  public saveValuesetPreDef(id, preDef): Promise<any> {
    const valueset = new IObject();
    valueset.id = id;
    valueset.preDef = preDef;
    return this.valuesetsIndexedDbService.saveValueset(valueset);
  }

  public saveValuesetPostDef(id, postDef): Promise<any> {
    const valueset = new IObject();
    valueset.id = id;
    valueset.postDef = postDef;
    return this.valuesetsIndexedDbService.saveValueset(valueset);
  }

  public saveValuesetCrossReferences(id, crossReference): Promise<any> {
    const valueset = new IObject();
    valueset.id = id;
    valueset.crossReference = crossReference;
    return this.valuesetsIndexedDbService.saveValueset(valueset);
  }

  public saveValuesetConformanceStatements(id, conformanceStatements): Promise<any> {
    const valueset = new IObject();
    valueset.id = id;
    valueset.conformanceStatements = conformanceStatements;
    return this.valuesetsIndexedDbService.saveValueset(valueset);
  }

}
