/**
 * Created by hnt5 on 12/3/17.
 */
import 'rxjs/add/operator/do';
import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {Injectable} from "@angular/core";
import {ProgressHandlerService} from "./service/progress-handler.service";
import { tap } from 'rxjs/operators';
import {HttpResponse} from "@angular/common/http";
import {catchError} from "rxjs/operators/catchError";
import {MessageService} from "primeng/components/common/messageservice";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor( private router: Router, private progress: ProgressHandlerService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    this.progress.setHttpStatus(true);
    console.log("Called");

    console.log(request.method);

    return next.handle(request).do((event: HttpEvent<any>) => {

      this.progress.setHttpStatus(false);
      console.log("Called eeee");


      if (event instanceof HttpResponse && (request.method =="POST"||request.method =="DELETE")) {

        if(event.body&& event.body){
          this.progress.showNotification(event.body,"topLeft");
        }

      }



    }, (err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401 || err.status === 403) {
          console.log("UNAUTHORIZED");

          this.router.navigate(['/login']);
        }else{

          this.progress.showNotification(err.error,"topAlert");

        }
      }
    });

  }



}
