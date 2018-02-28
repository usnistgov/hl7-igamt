import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';

@Injectable()
export class EventService {
    
    constructor(private http: Http) {}

    getEvents() {
        return this.http.get('assets/demo/data/scheduleevents.json')
                    .toPromise()
                    .then(res => <any[]> res.json().data)
                    .then(data => { return data; });
    }
}