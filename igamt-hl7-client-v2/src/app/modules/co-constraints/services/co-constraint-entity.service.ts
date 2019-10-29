import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { combineLatest, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { IHL7v2TreeNode, IResourceRef } from '../../shared/components/hl7-v2-tree/hl7-v2-tree.component';
import { Type } from '../../shared/constants/type.enum';
import { ICoConstraintCollection, ICoConstraintVariesCell } from '../../shared/models/co-constraint.interface';
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
import { IResource } from '../../shared/models/resource.interface';
import { IField, ISegment } from '../../shared/models/segment.interface';
import { AResourceRepositoryService } from '../../shared/services/resource-repository.service';

@Injectable({
  providedIn: 'root',
})
export class CoConstraintEntityService {

  constructor() { }

  createOBXCoConstraintTable(segment: ISegment, repository: AResourceRepositoryService): Observable<ICoConstraintTable> {
    const table = {
      coconstraintMode: CoConstraintMode.TABLE,
      baseSegment: segment.id,
      headers: {
        selectors: [],
        constraints: [],
        narratives: [],
      },
      coconstraints: [],
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
      this.createHeaderForField(segment, obx3, repository, CoConstraintColumnType.CODE),
      this.createHeaderForField(segment, obx2, repository, CoConstraintColumnType.DATATYPE),
      this.createHeaderForField(segment, obx5, repository, CoConstraintColumnType.VARIES),
    ).pipe(
      map(([_obx3, _obx2, _obx5]) => {
        table.headers.selectors.push(_obx3);
        table.headers.constraints.push(_obx2);
        table.headers.constraints.push(_obx5);

        return table;
      }),
    );
  }

  createHeaderForField(segment: ISegment, field: IField, repository: AResourceRepositoryService, type: CoConstraintColumnType): Observable<IDataElementHeader> {
    return this.createDataElementHeaderFromValues(
      {
        pathId: field.id,
        position: field.position,
        type: field.type,
      },
      { id: field.ref.id, type: Type.DATATYPE },
      of(segment),
      'OBX-' + field.position,
      repository,
      type,
    );
  }

  createEmptyCoConstraintTable(segment: ISegment): ICoConstraintTable {
    return {
      coconstraintMode: CoConstraintMode.TABLE,
      baseSegment: segment.id,
      headers: {
        selectors: [],
        constraints: [],
        narratives: [],
      },
      coconstraints: [],
      groups: [],
    };
  }

  createEmptyCoConstraint(headers: ICoConstraintHeaders): ICoConstraint {
    return {
      id: '',
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

  createDataElementHeader(node: IHL7v2TreeNode, parent: IResource, name: string, repository: AResourceRepositoryService, columnType: CoConstraintColumnType): Observable<IDataElementHeader> {
    const parentRef = node.parent.data.ref;
    return this.createDataElementHeaderFromValues(
      {
        pathId: node.data.pathId,
        position: node.data.position,
        type: node.data.type,
      },
      node.data.ref.value,
      !parentRef ? of(parent) : repository.fetchResource(parentRef.value.type, parentRef.value.id),
      name,
      repository,
      columnType,
    );
  }

  createDataElementHeaderFromValues({ pathId, position, type }: { pathId: string, position: number, type: Type }, elmRef: IResourceRef, parent: Observable<IResource>, name: string, repository: AResourceRepositoryService, columnType: CoConstraintColumnType): Observable<IDataElementHeader> {
    return combineLatest(
      parent,
      repository.fetchResource(elmRef.type, elmRef.id)).pipe(
        map(([p, resource]) => {
          return {
            key: pathId,
            type: CoConstraintHeaderType.DATAELEMENT,
            columnType,
            name,
            elementInfo: {
              version: resource.domainInfo.version,
              parent: p.name,
              elementName: resource.name,
              location: position,
              type,
            },
          };
        }),
      );
  }

  addColumn(header: ICoConstraintHeader, collection: ICoConstraintCollection) {
    const cell = this.createEmptyCell((header as IDataElementHeader).columnType);
    let list = [];
    if (collection.coconstraintMode === CoConstraintMode.TABLE) {
      (collection as ICoConstraintTable).groups.filter((groupBinding) => {
        return groupBinding.type === CoConstraintGroupBindingType.CONTAINED;
      }).map((groupBinding) => {
        return groupBinding as ICoConstraintGroupBindingContained;
      }).forEach((binding) => {
        list = list.concat(binding.coconstraints);
      });
    }
    list = list.concat(collection.coconstraints);
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

  createEmptyCoConstraintGroup(segment: ISegment): ICoConstraintGroup {
    return {
      coconstraintMode: CoConstraintMode.GROUP,
      name: '',
      baseSegment: segment.id,
      headers: {
        selectors: [],
        constraints: [],
        narratives: [],
      },
      coconstraints: [],
    };
  }

  createEmptyContainedGroupBinding(): ICoConstraintGroupBindingContained {
    return {
      type: CoConstraintGroupBindingType.CONTAINED,
      requirement: this.createEmptyRequirements(),
      name: '',
      coconstraints: [],
    };
  }

  createEmptyRequirements(): ICoConstraintRequirement {
    return {
      usage: 'R',
      cardinality: {
        min: 0,
        max: '*',
      },
    };
  }

}
