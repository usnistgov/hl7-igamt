import { BehaviorSubject, Observable } from 'rxjs';
import { IChangeReason, ILocationChangeLog, PropertyType } from '../models/save-change';
import { IBindingContext } from './structure-element-binding.service';

export interface IChangeReasonSection extends IChangeReason {
  property: PropertyType;
  context: IBindingContext;
}

export interface IChangeLogMap {
  [property: string]: {
    [context: string]: IChangeReasonSection;
  };
}

export class ChangeLogService {

  private map: IChangeLogMap;
  private locationChangeLog: ILocationChangeLog;
  private initial: IChangeLogMap;
  private changeDisplaySections: BehaviorSubject<IChangeReasonSection[]>;
  changeDisplaySections$: Observable<IChangeReasonSection[]>;

  constructor(log: ILocationChangeLog, private props: PropertyType[]) {
    this.changeDisplaySections = new BehaviorSubject([]);
    this.changeDisplaySections$ = this.changeDisplaySections.asObservable();
    this.init(log);
  }

  init(log: ILocationChangeLog) {
    this.locationChangeLog = log;
    const v = {};
    Object
      .keys(log)
      .filter((p) => this.props.includes(p as PropertyType))
      .forEach((prop) => {
        log[prop].forEach((e) => {
          const ctx = this.getContextKey(e.context);
          v[prop] = {
            ...v[prop],
            [ctx]: {
              ...e.log,
              context: e.context,
              property: prop as PropertyType,
            },
          };
        });
      });
    this.map = v;
    this.initial = {
      ...v,
    };
    this.changeDisplaySections.next(this.getDisplayList());
  }

  getContextKey(context: IBindingContext) {
    return context.resource.toString() + (context.element ? '_' + context.element.toString() : '');
  }

  put(change: IChangeReasonSection) {
    if (!this.props.includes(change.property)) {
      return;
    }
    const ctx = this.getContextKey(change.context);
    if (change && change.reason && change.reason !== '') {
      this.map = {
        ...this.map,
        [change.property]: {
          ...this.map[change.property],
          [ctx]: { ...change },
        },
      };
    } else {
      delete (this.map[change.property] || {})[ctx];
    }
    this.updateLocationChangeLog(change);
    this.changeDisplaySections.next(this.getDisplayList());
  }

  updateLocationChangeLog({ context, property, reason, date }: IChangeReasonSection) {
    const item = {
      context,
      log: {
        date,
        reason,
      },
    };
    const propertyChangeList = this.locationChangeLog[property];
    if (propertyChangeList) {
      const index = propertyChangeList.findIndex((n) => n.context.resource === context.resource && n.context.element === context.element);
      if (index !== -1) {
        if (reason) {
          propertyChangeList[index].log = item.log;
        } else {
          propertyChangeList.splice(index, 1);
        }
      } else {
        if (reason) {
          propertyChangeList.push(item);
        }
      }
    } else {
      if (reason) {
        this.locationChangeLog[property] = [item];
      }
    }
  }

  get(property: PropertyType, context: IBindingContext): IChangeReasonSection {
    const ctx = this.getContextKey(context);
    return (this.map[property] || {})[ctx];
  }

  getInit(property: PropertyType, context: IBindingContext): IChangeReasonSection {
    const ctx = this.getContextKey(context);
    return (this.initial[property] || {})[ctx];
  }

  getDisplayList(): IChangeReasonSection[] {
    const ls: IChangeReasonSection[] = [];
    Object.keys(this.map).forEach((p) => {
      Object.keys(this.map[p]).forEach((c) => {
        ls.push({
          ...this.map[p][c],
        });
      });
    });
    return ls;
  }

}
