import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {DatatypeEvolutionService} from './datatype-evolution.service';

@Injectable({
  providedIn: 'root',
})
export class DatatypeEvolutionResolver implements Resolve<any> {
  constructor(private http: HttpClient, private datatypeEvolutionService: DatatypeEvolutionService) {

  }

  resolve(route: ActivatedRouteSnapshot, rstate: RouterStateSnapshot): Observable<any> {
    return this.datatypeEvolutionService.getClasses();
  }
}
