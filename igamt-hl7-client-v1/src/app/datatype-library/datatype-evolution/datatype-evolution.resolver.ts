import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot, Resolve} from "@angular/router";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {DatatypeEvolutionService} from "./datatype-evolution.service";

@Injectable()
export class DatatypeEvolutionResolver implements Resolve<any> {
  constructor(private http : HttpClient, private datatypeEvolutionService: DatatypeEvolutionService) {

  }

  resolve(route: ActivatedRouteSnapshot, rstate: RouterStateSnapshot): Observable<any> {
  return this.datatypeEvolutionService.getClasses();

  }
}
