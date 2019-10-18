import { Injectable } from '@angular/core';
import { IHL7v2TreeNode } from '../../shared/components/hl7-v2-tree/hl7-v2-tree.component';
import {
  ICoConstraintCodeCell,
  ICoConstraintDatatypeCell,
  ICoConstraintGroup,
  ICoConstraintGroupBindingContained,
  ICoConstraintGroupBindingType,
  ICoConstraintHeaders,
  ICoConstraintHeaderType,
  ICoConstraintRequirement,
  ICoConstraintTable,
} from '../../shared/models/co-constraint.interface';
import {
  ICoConstraint,
  ICoConstraintCell,
  ICoConstraintCells,
  ICoConstraintColumnType,
  ICoConstraintHeader,
  ICoConstraintValueCell,
  ICoConstraintValueSetCell,
  IDataElementHeader,
} from '../../shared/models/co-constraint.interface';
import { ISegment } from '../../shared/models/segment.interface';
import { Observable } from 'rxjs';
import { AResourceRepositoryService } from '../../shared/services/resource-repository.service';

@Injectable({
  providedIn: 'root',
})
export class CoConstraintEntityService {

  constructor() { }

  createEmptyCoConstraintTable(segment: ISegment): ICoConstraintTable {
    return {
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
      const cell = this.createEmptyCell(header);
      if (cell) {
        cells[header.key] = cell;
      }
    });
    return cells;
  }

  createDataElementHeader(node: IHL7v2TreeNode, repository: AResourceRepositoryService, columnType: ICoConstraintColumnType): Observable<IDataElementHeader> {
    const elmRef = node.data.ref.value;
    return undefined;
    // return {
    //   key: node.data.pathId,
    //   type: ICoConstraintHeaderType.DATAELEMENT,
    //   elementType: node.data.type,
    //   columnType,
    //   name: '',
    //   elementInfo: {
    //     datatype: '',
    //     version: '',
    //   },
    // };
  }

  createEmptyCell(header: ICoConstraintHeader): ICoConstraintCell {
    switch (header.type) {
      case ICoConstraintHeaderType.DATAELEMENT:
        const dataElementHeader = header as IDataElementHeader;
        switch (dataElementHeader.columnType) {
          case ICoConstraintColumnType.CODE:
            return this.createEmptyCodeCell();
          case ICoConstraintColumnType.DATATYPE:
            return this.createEmptyDatatypeCell();
          case ICoConstraintColumnType.VALUE:
            return this.createEmptyValueCell();
          case ICoConstraintColumnType.VALUESET:
            return this.createEmptyValueSetCell();
          default:
            return undefined;
        }
      case ICoConstraintHeaderType.NARRATIVE:
        return this.createEmptyValueCell();
      default:
        return undefined;
    }
  }

  createEmptyCodeCell(): ICoConstraintCodeCell {
    return {
      type: ICoConstraintColumnType.CODE,
      code: '',
      codeSystem: '',
      locations: [],
    };
  }

  createEmptyValueSetCell(): ICoConstraintValueSetCell {
    return {
      type: ICoConstraintColumnType.VALUESET,
      bindings: [],
    };
  }

  createEmptyDatatypeCell(): ICoConstraintDatatypeCell {
    return {
      type: ICoConstraintColumnType.DATATYPE,
      datatypeId: '',
    };
  }

  createEmptyValueCell(): ICoConstraintValueCell {
    return {
      type: ICoConstraintColumnType.VALUE,
      value: '',
    };
  }

  createEmptyCoConstraintGroup(segment: ISegment): ICoConstraintGroup {
    return {
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

  createEmptyContainedGroupBinding(segment: ISegment): ICoConstraintGroupBindingContained {
    return {
      type: ICoConstraintGroupBindingType.CONTAINED,
      requirement: this.createEmptyRequirements(),
      name: '',
      coconstraints: [],
    };
  }

  createEmptyRequirements(): ICoConstraintRequirement {
    return {
      usage: '',
      cardinality: {
        min: 0,
        max: '*',
      },
    };
  }

}
