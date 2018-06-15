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
}
