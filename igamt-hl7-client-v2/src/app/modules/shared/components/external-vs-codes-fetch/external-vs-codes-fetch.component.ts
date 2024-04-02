import { Component, Input, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ExternalCodeSetService, IResponseError } from '../../services/external-codeset.service';

@Component({
    selector: 'app-external-vs-codes-fetch',
    templateUrl: './external-vs-codes-fetch.component.html',
    styleUrls: ['./external-vs-codes-fetch.component.css'],
})

export class ExternalVsCodesFetchComponent implements OnInit {

    @Input()
    URL: string;
    useKey = false;
    error: IResponseError;
    loading = false;
    key: string;

    constructor(private codeService: ExternalCodeSetService) { }

    fetch() {
        this.loading = true;
        this.codeService.fetchCodes(this.URL, this.key).pipe(
            tap((result) => {
                this.loading = false;
                this.useKey = false;
                this.error = undefined;
            }),
            catchError((error) => {
                if (error.statusCode === 403) {
                    this.useKey = true;
                }
                this.error = error;
                this.loading = false;
                return of();
            }),
        ).subscribe();
    }

    ngOnInit() { }
}
