import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AuthenticationService} from '../core/services/authentication.service';
import {IDocumentationWrapper} from './models/documentation.interface';
import {DocumentationService} from './service/documentation.service';
@Injectable()
export class DocumentationResolver implements Resolve<IDocumentationWrapper> {

  constructor(private authenticationService: AuthenticationService, private router: Router, private documentationService: DocumentationService) {

  }

  resolve(route: ActivatedRouteSnapshot, rstate: RouterStateSnapshot): Observable<IDocumentationWrapper> {

    return this.documentationService.getDocumentation();
}
}
