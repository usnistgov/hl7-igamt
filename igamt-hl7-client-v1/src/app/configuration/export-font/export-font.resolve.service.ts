import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router} from '@angular/router';
import {ExportFontService} from '../../service/configuration/export-font/export-font.service';

@Injectable()
export class ExportFontResolve implements Resolve<any> {
  constructor(private exportFontService: ExportFontService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot): Promise<any> | boolean {
    return this.exportFontService.getExportFont().then(exportFontConfigurationDisplay => {
      return exportFontConfigurationDisplay;
    }).catch(error => {
      this.router.navigate(['']);
      return false;
    });
  }
}
