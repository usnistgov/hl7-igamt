import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class TestplanService {

    constructor(private http: Http) {}

    getMyTestPlanListAbstract() {
        return this.http.get('assets/data/abstractMyTestPlans.json')
            .toPromise()
            .then(res => <any[]> res.json())
            .then(data => { return data; });
    }

    getSharedTestPlanListAbstract() {
        return this.http.get('assets/data/abstractSharedTestPlans.json')
            .toPromise()
            .then(res => <any[]> res.json())
            .then(data => { return data; });
    }

    getTestPlan(id:any) {
        console.log("PLEASE");
        console.log(id);
        return this.http.get('assets/data/abstractSharedTestPlans.json')
            .toPromise()
            .then(res => <any[]> res.json())
            .then(data => { return data; });
    }
}