import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ExternalCodeSetService, ICodeSetQueryResult, IResponseError } from '../../services/external-codeset.service';

@Component({
    selector: 'app-external-vs-codes-fetch',
    templateUrl: './external-vs-codes-fetch.component.html',
    styleUrls: ['./external-vs-codes-fetch.component.css'],
})

export class ExternalVsCodesFetchComponent implements OnInit {

    @Input()
    URL: string;
    @Output()
    codeSet: EventEmitter<ICodeSetQueryResult> = new EventEmitter<ICodeSetQueryResult>();
    useKey = false;
    error: IResponseError;
    loading = false;
    key: string;
    fetchDate: Date = null;
    fetchedCodeSet: ICodeSetQueryResult;
    columns = [
        {
            field: 'value',
            label: 'Code',
        },
        {
            field: 'regularExpression',
            label: 'Pattern',
        },
        {
            field: 'displayText',
            label: 'Display Text',
        },
        {
            field: 'codeSystem',
            label: 'Code System',
        },
        {
            field: 'usage',
            label: 'Usage',
        },
    ];

    constructor(private codeService: ExternalCodeSetService) { }

    fetch() {
        this.loading = true;
        this.fetchDate = new Date();
        this.fetchedCodeSet = null;
        this.codeSet.emit(null);
        this.useKey = false;
        this.error = undefined;
        setTimeout(() => {
            this.codeService.fetchCodes(this.URL, this.key).pipe(
                tap((result) => {
                    this.fetchedCodeSet = result;
                    this.codeSet.emit(result);
                    this.loading = false;
                }),
                catchError((error) => {
                    if (error.statusCode === 403) {
                        this.useKey = true;
                    }
                    this.fetchedCodeSet = null;
                    this.codeSet.emit(null);
                    this.error = error;
                    this.loading = false;
                    return of();
                }),
            ).subscribe();
        }, 500);
    }

    ngOnInit() { }
}
