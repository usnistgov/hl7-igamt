import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Icons } from '../../constants/icons.enum';
import { Scope } from '../../constants/scope.enum';
import { Type } from '../../constants/type.enum';
import { IDisplayElement } from '../../models/display-element.interface';
import { SubMenu } from '../../models/sub-menu.class';

@Component({
  selector: 'app-toc-sub-menu',
  templateUrl: './toc-sub-menu.component.html',
  styleUrls: ['./toc-sub-menu.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TocSubMenuComponent implements OnInit {
  @Input() element: IDisplayElement;

  @Input() delta: boolean;
  @Input() pcId: string;
  items: SubMenu[];
  constructor() {
  }

  ngOnInit() {
    if (this.element.type) {
      this.items = this.getMenuItems();
    }
    if (this.pcId) {
      this.items = this.getProfileComponentMenuItems();
    }
  }

  // tslint:disable-next-line:cognitive-complexity
  getMenuItems() {
    const type = this.element.type.toLowerCase();
    const ret: SubMenu[] = [];
    if (type === Type.COCONSTRAINTGROUP.toLowerCase()) {
      ret.push(new SubMenu('./' + type + '/' + this.element.id + '/' + 'structure', 'Table', Icons.TABLE));
    } else {
      if (type === Type.COMPOSITEPROFILE.toLowerCase()) {
        ret.push(new SubMenu('./' + type + '/' + this.element.id + '/' + 'composition', 'Composition', Icons.LIST));
      }
      ret.push(new SubMenu('./' + type + '/' + this.element.id + '/' + 'metadata', 'Metadata', Icons.EDIT));
      ret.push(new SubMenu('./' + type + '/' + this.element.id + '/' + 'pre-def', 'Pre-definition', Icons.PRE));
      if (type !== Type.VALUESET.toLowerCase()) {
        ret.push(new SubMenu('./' + type + '/' + this.element.id + '/' + 'structure', 'Structure', Icons.TABLE));
      } else {
        ret.push(new SubMenu('./' + type + '/' + this.element.id + '/' + 'structure', 'Value Set Definition', Icons.TABLE));
      }

      if ([Type.DATATYPE.toLowerCase(), Type.SEGMENT.toLowerCase(), Type.CONFORMANCEPROFILE.toLowerCase()].includes(type)) {
        ret.push(new SubMenu('./' + type + '/' + this.element.id + '/' + 'bindings', 'Bindings', Icons.BINDING));
      }
      if ([Type.SEGMENT.toLowerCase(), Type.CONFORMANCEPROFILE.toLowerCase()].includes(type) && this.element.domainInfo !== null && this.element.domainInfo.scope !== Scope.HL7STANDARD) {
        ret.push(new SubMenu('./' + type + '/' + this.element.id + '/' + 'slicing', 'Slicing', Icons.SLICING));
      }
      ret.push(new SubMenu('./' + type + '/' + this.element.id + '/' + 'post-def', 'Post-definition', Icons.POST));

      if (type !== Type.VALUESET.toLowerCase() && type !== Type.COMPOSITEPROFILE.toLowerCase()) {
        ret.push(new SubMenu('./' + type + '/' + this.element.id + '/' + 'conformance-statement', 'Conformance statements', Icons.TABLE));
      }
      if ((type === Type.SEGMENT.toLocaleLowerCase() || type === Type.SEGMENTCONTEXT.toLocaleLowerCase()) && this.element.fixedName.startsWith('OBX')) {
        ret.push(new SubMenu('./' + type + '/' + this.element.id + '/' + 'dynamic-mapping', 'Dynamic Mapping', Icons.LIST));
      }
      if (type === Type.CONFORMANCEPROFILE.toLowerCase()) {
        ret.push(new SubMenu('./' + type + '/' + this.element.id + '/' + 'co-constraint', 'Co-Constraints', Icons.TABLE));
      }
    }
    if (type !== Type.COMPOSITEPROFILE.toLowerCase()) {
      ret.push(new SubMenu('./' + type + '/' + this.element.id + '/' + 'cross-references', 'Cross references', Icons.LIST));
    }

    if (this.element.origin) {

      if (!this.isDateAndTime()) {
        ret.push(new SubMenu('./' + type + '/' + this.element.id + '/' + 'delta', 'Differential', Icons.LIST));
      } else {
        ret.push(new SubMenu('./' + type + '/' + this.element.id + '/' + 'dtm-delta', 'Differential', Icons.LIST));
      }
    }
    return ret;
  }
  isDateAndTime() {
    return this.element.fixedName === 'DT' || this.element.fixedName === 'TM' || this.element.fixedName === 'DTM';
  }

  private getProfileComponentMenuItems() {
    const ret: SubMenu[] = [];

    let url = './profilecomponent/' + this.pcId + '/';
    if (this.element.type === Type.SEGMENTCONTEXT) {
      url = url + 'segment/';
    }
    if (this.element.type === Type.MESSAGECONTEXT) {
      url = url + 'message/';
    }
    url = url + this.element.id;

    ret.push(new SubMenu(url + '/structure', 'Structure', Icons.TABLE));
    ret.push(new SubMenu(url + '/conformance-statement', 'Conformance statements', Icons.TABLE));
    if (this.element.type === Type.SEGMENTCONTEXT && this.element.fixedName.startsWith('OBX')) {
      ret.push(new SubMenu(url + '/dynamic-mapping', 'Dynamic Mapping', Icons.LIST));
    }
    if (this.element.type === Type.MESSAGECONTEXT) {
      ret.push(new SubMenu(url + '/co-constraint', 'Co-Constraints', Icons.TABLE));
    }
    return ret;
  }
}
