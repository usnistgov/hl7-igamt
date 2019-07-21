import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Icons } from '../../constants/icons.enum';
import { IDisplayElement } from '../../models/display-element.interface';
import { SubMenu } from '../../models/sub-menu.class';
import {Type} from "../../constants/type.enum";

@Component({
  selector: 'app-toc-sub-menu',
  templateUrl: './toc-sub-menu.component.html',
  styleUrls: ['./toc-sub-menu.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TocSubMenuComponent implements OnInit {
  @Input() element: IDisplayElement;

  items: SubMenu[];
  constructor() {
  }

  ngOnInit() {
    if (this.element.type) {
      this.items = this.getMenuItems();
    }
  }

  getMenuItems() {

    const type = this.element.type.toLowerCase();
    const ret: SubMenu[] = [];
    ret.push(new SubMenu('./' + type + '/' + this.element.id + '/' + 'metadata', 'Metadata', Icons.EDIT));

    ret.push(new SubMenu('./' + type + '/' + this.element.id + '/' + 'pre-def', 'Pre-definition', Icons.PRE));

    ret.push(new SubMenu('./' + type + '/' + this.element.id + '/' + 'structure', 'Structure', Icons.TABLE));

    ret.push(new SubMenu('./' + type + '/' + this.element.id + '/' + 'post-def', 'Post-definition', Icons.POST));
    if (type !== Type.VALUESET) {
      ret.push(new SubMenu('./' + type + '/' + this.element.id + '/' + 'conformance-statement', 'Conformance statements', Icons.TABLE));

    }
    if (type === 'segment' && this.element.fixedName === 'OBX') {
      ret.push(new SubMenu('./' + type + '/' + this.element.id + '/' + 'co-constraint', 'Co-Constraints', Icons.TABLE));

      ret.push(new SubMenu('./' + type + '/' + this.element.id + '/' + 'dynamic-mapping', 'Dynamic mapping', Icons.TABLE));
    }
    ret.push(new SubMenu('./' + type + '/' + this.element.id + '/' + 'cross-references', 'Cross references', Icons.LIST));
    return ret;
  }
}
