import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class ExportFontService {
  constructor(private http: HttpClient) {
  }

  public getExportFont(): Promise<object> {
    return new Promise<object>((resolve, reject) => {
      this.http.get('api/configuration/exportFont').subscribe(exportFont => {
        resolve(exportFont);
      }, error => {
        reject(error);
      });
    });
  }

  public saveExportFont(exportFont): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.http.post('api/configuration/exportFont/save', exportFont).subscribe(() => {
        resolve();
      }, error => {
        reject(error);
      });
    });
  }
}
