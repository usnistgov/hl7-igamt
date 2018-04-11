import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CountryService {

    constructor(private http: HttpClient) {}

    getCountries() {
        return this.http.get<any>('assets/demo/data/countries.json')
                    .toPromise()
                    .then(res => <any[]> res.data)
                    .then(data => data);
    }
}
