import { BehaviorSubject, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { IResourceRef } from '../../shared/components/hl7-v2-tree/hl7-v2-tree.component';
import { Type } from '../../shared/constants/type.enum';
import { IProfileComponentItem, IPropertyDatatype, IPropertyRef } from '../../shared/models/profile.component';
import { PropertyType } from '../../shared/models/save-change';

export interface ITreeStructureProfileComponentPermutation {
  ref?: IResourceRef;
  children?: Record<string, ITreeStructureProfileComponentPermutation>;
}

export class ProfileComponentRefChange {
  private permutations$: BehaviorSubject<Record<string, ITreeStructureProfileComponentPermutation>>;

  constructor(items: IProfileComponentItem[]) {
    this.permutations$ = new BehaviorSubject(this.getStructurePermutation(items));
  }

  get value$(): Observable<Record<string, ITreeStructureProfileComponentPermutation>> {
    return this.permutations$.asObservable();
  }

  containsPath(path: string) {
    return this.getPath(path) !== undefined;
  }

  getPath(path: string): IResourceRef {
    const inner = (parts: string[], perms: Record<string, ITreeStructureProfileComponentPermutation>): IResourceRef => {
      const location = parts.pop();

      if (perms[location] && parts.length === 0) {
        return perms[location].ref;
      }

      if (!perms[location] || !perms[location].children) {
        return undefined;
      }

      return inner(parts, perms[location].children);
    };
    return inner(path.split('-'), this.permutations$.getValue());
  }

  getStructurePermutation(items: IProfileComponentItem[]) {
    const perms: Record<string, ITreeStructureProfileComponentPermutation> = {};
    items.forEach((item) => {
      const datatypes = item.itemProperties
        .filter((prop) => prop.propertyKey === PropertyType.DATATYPE)
        .map((p: IPropertyDatatype) => ({
          id: p.datatypeId,
          type: Type.DATATYPE,
        } as IResourceRef));

      const segments = item.itemProperties
        .filter((prop) => prop.propertyKey === PropertyType.SEGMENTREF)
        .map((p: IPropertyRef) => ({
          id: p.ref,
          type: Type.SEGMENT,
        } as IResourceRef));

      [...datatypes, ...segments].forEach((ref) => {
        this.insertIn(item.path, ref, perms);
      });
    });
    return perms;
  }

  private insertIn(path: string, ref: IResourceRef, target: Record<string, ITreeStructureProfileComponentPermutation>) {
    const inner = (parts: string[], perms: Record<string, ITreeStructureProfileComponentPermutation>) => {
      const location = parts.pop();

      if (!perms[location]) {
        perms[location] = {};
      }

      if (parts.length === 0) {
        perms[location].ref = ref;
      } else {
        perms[location].children = {};
        inner(parts, perms[location].children);
      }
    };
    return inner(path.split('-'), target);
  }

  insert(path: string, ref: IResourceRef) {
    this.permutations$.pipe(
      take(1),
      map((value) => {
        this.insertIn(path, ref, value);
        this.permutations$.next(value);
      }),
    ).subscribe();
  }

  clear(path: string) {
    if (this.containsPath(path)) {
      this.insert(path, undefined);
    }
  }
}
