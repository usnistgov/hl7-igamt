import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';

@Injectable()
export class CountryService {
    
    constructor(private http: Http) {}

    getCountries() {
        return this.http.get('assets/demo/data/countries.json')
                    .toPromise()
                    .then(res => <any[]> res.json().data)
                    .then(data => { return data; });
    }
}