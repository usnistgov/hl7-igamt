import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Car} from '../domain/car';

@Injectable()
export class CarService {

    constructor(private http: HttpClient) {}

    getCarsSmall() {
        return this.http.get<any>('assets/demo/data/cars-small.json')
                    .toPromise()
                    .then(res => <Car[]> res.data)
                    .then(data => data);
    }

    getCarsMedium() {
        return this.http.get<any>('assets/demo/data/cars-medium.json')
                    .toPromise()
                    .then(res => <Car[]> res.data)
                    .then(data => data);
    }

    getCarsLarge() {
        return this.http.get<any>('assets/demo/data/cars-large.json')
                    .toPromise()
                    .then(res => <Car[]> res.data)
                    .then(data => data);
    }
}
