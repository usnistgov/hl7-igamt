import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router} from '@angular/router';
import {TableOptionsService} from '../../service/configuration/table-options/table-options.service';

@Injectable()
export class ConformanceProfileTableOptionsResolve implements Resolve<any> {
  constructor(private tableOptionService: TableOptionsService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot): Promise<any> | boolean {
    return this.tableOptionService.getConformanceProfileTableOptions().then(tableOptions => {
      return tableOptions;
    }).catch(error => {
      this.router.navigate(['']);
      return false;
    });
  }
}
