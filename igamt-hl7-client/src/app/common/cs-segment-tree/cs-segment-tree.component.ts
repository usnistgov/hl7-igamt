import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TreeNode} from 'primeng/api';
import {GeneralConfigurationService} from '../../service/general-configuration/general-configuration.service';

@Component({
  selector: 'app-cs-segment-tree',
  templateUrl: './cs-segment-tree.component.html',
  styleUrls: ['./cs-segment-tree.component.css']
})
export class CsSegmentTreeComponent implements OnInit {

  _tree: TreeNode[];
  selectedNode: TreeNode;
  @Output() select: EventEmitter<any> = new EventEmitter<any>();
  @Input()  selectComplex = false;

  constructor(private configService: GeneralConfigurationService) {}

  @Input() set tree(tree: any){
    console.log(tree);
    const node: TreeNode = {
      label: tree.label,
      type: 'root',
      data: {
        id: tree.id.id,
        type: 'SEGMENT',
        version: tree.version,
        scope: tree.scope
      },
      children : this.configService.arraySortByPosition(tree.structure)
    };

    if (!this.selectComplex) {
      this.disableComplex(node);
    }

    this._tree = [node];
    console.log(this._tree);
  }

  disableComplex(node: TreeNode) {
    if (node.children && node.children.length > 0) {
      node.selectable = false;
      for (const child of node.children){
        this.disableComplex(child);
      }
    } else {
      node.selectable = true;
    }
  }

  selected(event) {
    this.selectedNode = event.node;
    this.select.emit(this.processPath(event.node));
  }

  processPath(n: TreeNode) {
    return this.pathList(n).reverse().reduce((pV, cV) => {
      cV.child = pV;
      return cV;
    });
  }

  pathList(node: TreeNode) {
    if (node.parent) {
      const parentList = this.pathList(node.parent);
      parentList.push({
        elementId: node.data.id,
        instanceParameter: '*'
      });
      return parentList;
    } else {
      return [
        {
          elementId: node.data.id,
        }
      ];
    }
  }

  ngOnInit() {

  }

}
