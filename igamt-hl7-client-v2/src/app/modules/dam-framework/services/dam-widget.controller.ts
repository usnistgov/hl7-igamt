import { Observable } from 'rxjs';

export abstract class DamController {

  protected constructor() { }

  abstract getTitleBarInfo<T>(payload: any): Observable<T>;
}
