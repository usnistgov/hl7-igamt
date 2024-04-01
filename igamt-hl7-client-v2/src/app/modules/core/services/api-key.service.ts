import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Type } from "../../shared/constants/type.enum";
import { IDisplayElement } from "../../shared/models/display-element.interface";
import { Observable } from "rxjs";
import { IMessage } from "../../dam-framework/models/messages/message.class";

export interface IAPIKeyDisplay {
    id: string;
    name: string;
    createdAt: Date;
    expireAt: Date;
    expired: boolean;
    resources: Record<Type, IDisplayElement[]>;
}

export interface IGeneratedAPIKey extends IAPIKeyDisplay {
    plainToken: string;
}

export interface IAPIKeyCreateRequest {
    name: string;
    expires: boolean;
    validityDays: number;
    resources: Record<Type, string[]>;
}

@Injectable({
    providedIn: 'root',
})
export class APIKeyService {
    constructor(private http: HttpClient) {
    }

    getAPIKeys(): Observable<IAPIKeyDisplay[]> {
        return this.http.get<IAPIKeyDisplay[]>("/api/access-keys");
    }

    deleteAPIKey(id: string): Observable<IMessage<never>> {
        return this.http.delete<IMessage<never>>("/api/access-keys/" + id);
    }

    createAPIKey(request: IAPIKeyCreateRequest): Observable<IMessage<IGeneratedAPIKey>> {
        return this.http.post<IMessage<IGeneratedAPIKey>>("/api/access-keys/create", request);
    }
}