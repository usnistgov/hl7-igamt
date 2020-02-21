import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import * as _ from 'lodash';
import { Md5 } from 'md5-typescript';
import { combineLatest, Observable, of } from 'rxjs';
import { flatMap, map, take } from 'rxjs/operators';
import { ICardinalityRange, IHL7v2TreeNode, IResourceKey } from '../../shared/components/hl7-v2-tree/hl7-v2-tree.component';
import { Type } from '../../shared/constants/type.enum';
import { ICoConstraintGroupBindingRef, ICoConstraintVariesCell, INarrativeHeader } from '../../shared/models/co-constraint.interface';
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
import { IResource } from '../../shared/models/resource.interface';
import { IField, ISegment } from '../../shared/models/segment.interface';
import { BindingService } from '../../shared/services/binding.service';
import { AResourceRepositoryService } from '../../shared/services/resource-repository.service';

@Injectable({
  providedIn: 'root',
})
export class CoConstraintEntityService {

  constructor(private binding: BindingService) { }

  exportAsExcel(table: ICoConstraintTable) {
    const form = document.createElement('form');
    form.action = '/api/export/coconstraintTable';
    form.method = 'POST';
    const json = document.createElement('input');
    json.type = 'hidden';
    json.name = 'json';
    json.value = JSON.stringify(table);
    form.appendChild(json);
    form.style.display = 'none';
    document.body.appendChild(form);
    form.submit();
  }

  mergeGroupWithTable(ccTable: ICoConstraintTable & ICoConstraintGroup, group: ICoConstraintGroup) {
    this.mergeHeaders(ccTable, ccTable.headers.selectors, group.headers.selectors);
    this.mergeHeaders(ccTable, ccTable.headers.constraints, group.headers.constraints);
    this.mergeHeaders(ccTable, ccTable.headers.narratives, group.headers.narratives);
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
      requirement: this.createEmptyRequirements(),
      type: CoConstraintGroupBindingType.REF,
      refId: id,
    };
  }

  createOBXCoConstraintTable(segment: ISegment, repository: AResourceRepositoryService): Observable<ICoConstraintTable> {
    const table: ICoConstraintTable = {
      type: CoConstraintMode.TABLE,
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
      this.createHeaderForField(segment, obx3, repository, false, CoConstraintColumnType.CODE),
      this.createHeaderForField(segment, obx2, repository, false, CoConstraintColumnType.DATATYPE),
      this.createHeaderForField(segment, obx5, repository, true, CoConstraintColumnType.VARIES),
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

  createHeaderForField(segment: ISegment, field: IField, repository: AResourceRepositoryService, cardinalityConstraint: boolean, type: CoConstraintColumnType): Observable<IDataElementHeader> {
    return this.createDataElementHeaderFromValues(
      {
        pathId: field.id,
        position: field.position,
        type: field.type,
        cardinality: {
          min: field.min,
          max: field.max,
        },
      },
      { id: field.ref.id, type: Type.DATATYPE },
      of(segment),
      'OBX-' + field.position,
      repository,
      cardinalityConstraint,
      type,
    );
  }

  createEmptyCoConstraintTable(segment: ISegment): ICoConstraintTable {
    return {
      type: CoConstraintMode.TABLE,
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

  createDataElementHeader(node: IHL7v2TreeNode, parent: IResource, name: string, repository: AResourceRepositoryService, cardinalityConstraint: boolean, columnType: CoConstraintColumnType): Observable<IDataElementHeader> {
    const parentRef = node.parent.data.ref;
    return this.createDataElementHeaderFromValues(
      {
        pathId: node.data.pathId,
        position: node.data.position,
        type: node.data.type,
        cardinality: node.data.cardinality,
      },
      node.data.ref.value,
      !parentRef ? of(parent) : repository.fetchResource(parentRef.value.type, parentRef.value.id),
      name,
      repository,
      cardinalityConstraint,
      columnType,
    );
  }

  createNarrativeHeader(title: string): INarrativeHeader {
    return {
      type: CoConstraintHeaderType.NARRATIVE,
      title,
      key: Md5.init(title),
    };
  }

  createDataElementHeaderFromValues({ pathId, position, cardinality, type }: { pathId: string, position: number, cardinality: ICardinalityRange, type: Type }, elmRef: IResourceKey, parent: Observable<IResource>, name: string, repository: AResourceRepositoryService, cardinalityConstraint: boolean, columnType: CoConstraintColumnType): Observable<IDataElementHeader> {
    return combineLatest(
      parent,
      repository.fetchResource(elmRef.type, elmRef.id)).pipe(
        take(1),
        flatMap(([p, resource]) => {
          return this.binding.getBingdingInfo(resource.domainInfo.version, p.name, resource.name, position, type).pipe(
            map((bindingInfo) => {
              return {
                key: pathId,
                type: CoConstraintHeaderType.DATAELEMENT,
                columnType,
                cardinality: cardinalityConstraint,
                name,
                elementInfo: {
                  version: resource.domainInfo.version,
                  parent: p.name,
                  datatype: resource.name,
                  location: position,
                  cardinality,
                  type,
                  bindingInfo,
                },
              };
            }),
          );
        }),
      );
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
