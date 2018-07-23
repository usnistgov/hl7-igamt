import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class TableOptionsService {
  constructor(private http: HttpClient) {
  }

  public getConformanceProfileTableOptions(): Promise<object> {
    return new Promise<object>((resolve, reject) => {
      this.http.get('api/configuration/tableOptions/conformanceProfile').subscribe(conformanceProfileTableOptions => {
        resolve(conformanceProfileTableOptions);
      }, error => {
        reject(error);
      });
    });
  }

  public saveConformanceProfileTableOptions(conformanceProfileTableOptions): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.http.post('api/configuration/tableOptions/conformanceProfile/save', conformanceProfileTableOptions).subscribe(() => {
        resolve();
      }, error => {
        reject(error);
      });
    });
  }

  public getSegmentTableOptions(): Promise<object> {
    return new Promise<object>((resolve, reject) => {
      this.http.get('api/configuration/tableOptions/segment').subscribe(segmentTableOptions => {
        resolve(segmentTableOptions);
      }, error => {
        reject(error);
      });
    });
  }

  public saveSegmentTableOptions(segmentTableOptions): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.http.post('api/configuration/tableOptions/segment/save', segmentTableOptions).subscribe(() => {
        resolve();
      }, error => {
        reject(error);
      });
    });
  }

  public getCompositeProfileTableOptions(): Promise<object> {
    return new Promise<object>((resolve, reject) => {
      this.http.get('api/configuration/tableOptions/compositeProfile').subscribe(compositeProfileTableOptions => {
        resolve(compositeProfileTableOptions);
      }, error => {
        reject(error);
      });
    });
  }

  public saveCompositeProfileTableOptions(compositeProfileTableOptions): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.http.post('api/configuration/tableOptions/compositeProfile/save', compositeProfileTableOptions).subscribe(() => {
        resolve();
      }, error => {
        reject(error);
      });
    });
  }

  public getProfileComponentTableOptions(): Promise<object> {
    return new Promise<object>((resolve, reject) => {
      this.http.get('api/configuration/tableOptions/profileComponent').subscribe(profileComponentTableOptions => {
        resolve(profileComponentTableOptions);
      }, error => {
        reject(error);
      });
    });
  }

  public saveProfileComponentTableOptions(profileComponentTableOptions): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.http.post('api/configuration/tableOptions/profileComponent/save', profileComponentTableOptions).subscribe(() => {
        resolve();
      }, error => {
        reject(error);
      });
    });
  }

  public getDatatypeTableOptions(): Promise<object> {
    return new Promise<object>((resolve, reject) => {
      this.http.get('api/configuration/tableOptions/datatype').subscribe(datatypeTableOptions => {
        resolve(datatypeTableOptions);
      }, error => {
        reject(error);
      });
    });
  }

  public saveDatatypeTableOptions(datatypeTableOptions): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.http.post('api/configuration/tableOptions/datatype/save', datatypeTableOptions).subscribe(() => {
        resolve();
      }, error => {
        reject(error);
      });
    });
  }

  public getValuesetTableOptions(): Promise<object> {
    return new Promise<object>((resolve, reject) => {
      this.http.get('api/configuration/tableOptions/valueset').subscribe(valuesetTableOptions => {
        resolve(valuesetTableOptions);
      }, error => {
        reject(error);
      });
    });
  }

  public saveValuesetTableOptions(valuesetTableOptions): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.http.post('api/configuration/tableOptions/valueset/save', valuesetTableOptions).subscribe(() => {
        resolve();
      }, error => {
        reject(error);
      });
    });
  }
}
