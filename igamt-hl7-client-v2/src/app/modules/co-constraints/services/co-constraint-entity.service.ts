import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import * as _ from 'lodash';
import { Md5 } from 'md5-typescript';
import { combineLatest, Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { IHL7v2TreeNode } from '../../shared/components/hl7-v2-tree/hl7-v2-tree.component';
import { ICoConstraintGroupBindingRef, ICoConstraintGrouper, ICoConstraintVariesCell, INarrativeHeader } from '../../shared/models/co-constraint.interface';
import {
  CoConstraintGroupBindingType,
  CoConstraintHeaderType,
  CoConstraintMode,
  ICoConstraintCodeCell,
  ICoConstraintDatatypeCell,
  ICoConstraintGroup,
  ICoConstraintGroupBindingContained,
  ICoConstraintHeaders,
  ICoConstraintRequirement,
  ICoConstraintTable,
} from '../../shared/models/co-constraint.interface';
import {
  CoConstraintColumnType,
  ICoConstraint,
  ICoConstraintCell,
  ICoConstraintCells,
  ICoConstraintHeader,
  ICoConstraintValueCell,
  ICoConstraintValueSetCell,
  IDataElementHeader,
} from '../../shared/models/co-constraint.interface';
import { IField, ISegment } from '../../shared/models/segment.interface';
import { AResourceRepositoryService } from '../../shared/services/resource-repository.service';

@Injectable({
  providedIn: 'root',
})
export class CoConstraintEntityService {

  constructor() { }

  exportAsExcel(table: ICoConstraintTable, conformanceProfileId: string, contextId: string, segmentRef: string) {
    const form = document.createElement('form');
    form.action = '/api/export/coconstraintTable';
    form.method = 'POST';

    const json = document.createElement('input');
    json.type = 'hidden';
    json.name = 'json';
    json.value = JSON.stringify(table);
    form.appendChild(json);

    const conformanceProfileIdElm = document.createElement('input');
    conformanceProfileIdElm.type = 'hidden';
    conformanceProfileIdElm.name = 'conformanceProfileId';
    conformanceProfileIdElm.value = conformanceProfileId;
    form.appendChild(conformanceProfileIdElm);

    const contextIdElm = document.createElement('input');
    contextIdElm.type = 'hidden';
    contextIdElm.name = 'contextId';
    contextIdElm.value = contextId;
    form.appendChild(contextIdElm);

    const segmentRefElm = document.createElement('input');
    segmentRefElm.type = 'hidden';
    segmentRefElm.name = 'segmentRef';
    segmentRefElm.value = segmentRef;
    form.appendChild(segmentRefElm);

    form.style.display = 'none';
    document.body.appendChild(form);
    form.submit();
  }

  mergeGroupWithTable(ccTable: ICoConstraintTable & ICoConstraintGroup, group: ICoConstraintGroup) {
    this.mergeHeaders(ccTable, ccTable.headers.selectors, group.headers.selectors);
    this.mergeHeaders(ccTable, ccTable.headers.constraints, group.headers.constraints);
    this.mergeHeaders(ccTable, ccTable.headers.narratives, group.headers.narratives);
    if (!ccTable.headers.grouper) {
      ccTable.headers.grouper = group.headers.grouper;
    }
  }

  mergeHeaders(collection: ICoConstraintTable & ICoConstraintGroup, table: ICoConstraintHeader[], group: ICoConstraintHeader[]) {
    group.forEach((groupHeader) => {

      const header = table.find((tableHeader) => {
        return groupHeader.key === tableHeader.key;
      });

      if (!header) {
        table.push({
          ...groupHeader,
          _keep: true,
        });
        this.addColumn(groupHeader, collection);
      } else {
        header._keep = true;
      }

    });
  }

  createCoConstraintGroupBinding(id: string): ICoConstraintGroupBindingRef {
    return {
      id: Guid.create().toString(),
      requirement: this.createEmptyRequirements(),
      type: CoConstraintGroupBindingType.REF,
      refId: id,
    };
  }

  createOBXCoConstraintTable(segment: ISegment, repository: AResourceRepositoryService): Observable<ICoConstraintTable> {
    const table: ICoConstraintTable = {
      tableType: CoConstraintMode.TABLE,
      baseSegment: segment.id,
      headers: {
        selectors: [],
        constraints: [],
        narratives: [],
      },
      coConstraints: [],
      groups: [],
    };

    const obx3 = segment.children.find((field) => {
      return field.position === 3;
    });

    const obx2 = segment.children.find((field) => {
      return field.position === 2;
    });

    const obx5 = segment.children.find((field) => {
      return field.position === 5;
    });

    return combineLatest(
      this.createHeaderForField(segment, obx3, CoConstraintColumnType.CODE),
      this.createHeaderForField(segment, obx2, CoConstraintColumnType.DATATYPE),
      this.createHeaderForField(segment, obx5, CoConstraintColumnType.VARIES),
    ).pipe(
      take(1),
      map(([_obx3, _obx2, _obx5]) => {
        table.headers.selectors.push(_obx3);
        table.headers.constraints.push(_obx2);
        table.headers.constraints.push(_obx5);

        return table;
      }),
    );
  }

  createHeaderForField(segment: ISegment, field: IField, type: CoConstraintColumnType): Observable<IDataElementHeader> {
    return this.createDataElementHeaderFromValues(field.id, segment.name + '-' + field.position, type);
  }

  createEmptyCoConstraintTable(segment: ISegment): ICoConstraintTable {
    return {
      tableType: CoConstraintMode.TABLE,
      baseSegment: segment.id,
      headers: {
        selectors: [],
        constraints: [],
        narratives: [],
      },
      coConstraints: [],
      groups: [],
    };
  }

  createCoConstraintTableForSegment(segment: ISegment, repository: AResourceRepositoryService): Observable<ICoConstraintTable> {
    if (segment.name === 'OBX') {
      return this.createOBXCoConstraintTable(segment, repository);
    } else {
      return of(this.createEmptyCoConstraintTable(segment));
    }
  }

  getDefaultGrouper(segment: ISegment, tree: IHL7v2TreeNode[]): ICoConstraintGrouper {
    if (segment.name === 'OBX') {
      const OBX_4 = tree.find((elm) => elm.data.position === 4);
      if (OBX_4 && (OBX_4.leaf || OBX_4.data.ref.getValue().name === 'OG')) {
        return {
          pathId: OBX_4.data.pathId,
        };
      }
    }

    return undefined;
  }

  createEmptyCoConstraint(headers: ICoConstraintHeaders): ICoConstraint {
    return {
      id: Guid.create().toString(),
      requirement: this.createEmptyRequirements(),
      cells: this.createCellsFromHeaders(headers),
    };
  }

  createCellsFromHeaders(headers: ICoConstraintHeaders): ICoConstraintCells {
    const cells: ICoConstraintCells = {};
    [].concat(headers.selectors).concat(headers.constraints).concat(headers.narratives).forEach((header: ICoConstraintHeader) => {
      const cell = this.createEmptyCell((header as IDataElementHeader).columnType);
      if (cell) {
        cells[header.key] = cell;
      }
    });
    return cells;
  }

  createDataElementHeader(node: IHL7v2TreeNode, name: string, columnType: CoConstraintColumnType): Observable<IDataElementHeader> {
    return this.createDataElementHeaderFromValues(node.data.pathId, name, columnType);
  }

  createNarrativeHeader(title: string): INarrativeHeader {
    return {
      type: CoConstraintHeaderType.NARRATIVE,
      title,
      key: Md5.init(title),
    };
  }

  createDataElementHeaderFromValues(pathId: string, name: string, columnType: CoConstraintColumnType): Observable<IDataElementHeader> {
    return of({
      key: pathId,
      type: CoConstraintHeaderType.DATAELEMENT,
      columnType,
      name,
    });
  }

  getCoConstraintRowList(collection: ICoConstraintTable & ICoConstraintGroup): ICoConstraint[] {
    let list = [];
    if (collection.groups) {
      (collection as ICoConstraintTable).groups.filter((groupBinding) => {
        return groupBinding.type === CoConstraintGroupBindingType.CONTAINED;
      }).map((groupBinding) => {
        return groupBinding as ICoConstraintGroupBindingContained;
      }).forEach((binding) => {
        list = list.concat(binding.coConstraints);
      });
    }
    list = list.concat(collection.coConstraints);
    return list;
  }

  addColumn(header: ICoConstraintHeader, collection: ICoConstraintTable & ICoConstraintGroup) {
    const cell = this.createEmptyCell((header as IDataElementHeader).columnType);
    const list = this.getCoConstraintRowList(collection);
    list.forEach(
      (cc) => {
        cc.cells[header.key] = _.cloneDeep(cell);
      },
    );
  }

  createEmptyCell(columnType: CoConstraintColumnType): ICoConstraintCell {
    switch (columnType) {
      case CoConstraintColumnType.CODE:
        return this.createEmptyCodeCell();
      case CoConstraintColumnType.DATATYPE:
        return this.createEmptyDatatypeCell();
      case CoConstraintColumnType.VALUE:
        return this.createEmptyValueCell();
      case CoConstraintColumnType.VALUESET:
        return this.createEmptyValueSetCell();
      case CoConstraintColumnType.VARIES:
        return this.createEmptyVariesCell();
      default:
        return this.createEmptyValueCell();
    }
  }

  createEmptyCodeCell(): ICoConstraintCodeCell {
    return {
      type: CoConstraintColumnType.CODE,
      code: '',
      codeSystem: '',
      locations: [],
    };
  }

  createEmptyValueSetCell(): ICoConstraintValueSetCell {
    return {
      type: CoConstraintColumnType.VALUESET,
      bindings: [],
    };
  }

  createEmptyDatatypeCell(): ICoConstraintDatatypeCell {
    return {
      type: CoConstraintColumnType.DATATYPE,
      value: '',
      datatypeId: '',
    };
  }

  createEmptyVariesCell(): ICoConstraintVariesCell {
    return {
      type: CoConstraintColumnType.VARIES,
      cellType: undefined,
      cellValue: undefined,
    };
  }

  createEmptyValueCell(): ICoConstraintValueCell {
    return {
      type: CoConstraintColumnType.VALUE,
      value: '',
    };
  }

  createEmptyContainedGroupBinding(): ICoConstraintGroupBindingContained {
    return {
      id: Guid.create().toString(),
      type: CoConstraintGroupBindingType.CONTAINED,
      requirement: this.createEmptyRequirements(),
      name: '',
      coConstraints: [],
    };
  }

  createEmptyRequirements(): ICoConstraintRequirement {
    return {
      usage: 'R',
      cardinality: {
        min: 1,
        max: '*',
      },
    };
  }

}
