import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';

@Injectable()
export class NodeService {
    
    constructor(private http: Http) {}

    getFiles() {
        return this.http.get('assets/demo/data/files.json')
                    .toPromise()
                    .then(res => <any[]> res.json().data)
                    .then(data => { return data; });
    }
        
    getFilesystem() {
        return this.http.get('assets/demo/data/filesystem.json')
                    .toPromise()
                    .then(res => <any[]> res.json().data)
                    .then(data => { return data; });
    }
}