import { Component, Inject, OnInit } from '@angular/core';
import { IDisplayElement } from '../../models/display-element.interface';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
import { selectAllDatatypes } from 'src/app/root-store/dam-igamt/igamt.resource-display.selectors';
import { Scope } from '../../constants/scope.enum';

import { Guid } from 'guid-typescript';
import * as _ from 'lodash';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Type } from '../../constants/type.enum';
import { IAddingInfo, ISubstitution } from '../../models/adding-info';
import { ProfileType, Role } from '../../models/conformance-profile.interface';
import { IResource } from '../../models/resource.interface';
import { DisplayService } from '../../services/display.service';
import { ResourceService } from '../../services/resource.service';
import { FlavorSelection } from '../import-structure/import-structure.component';

@Component({
  selector: 'app-import-from-lib',
  templateUrl: './import-from-lib.component.html',
  styleUrls: ['./import-from-lib.component.scss']
})
export class ImportFromLibComponent implements OnInit {
  step = 0;
  table_: any[] = [];
  availables: NamingMap;
  viewOnly: boolean;
  map: FlavorSelection = {};
  duplicatedList = [];
  duplicated: NamingMap = {};

  constructor(public dialogRef: MatDialogRef<ImportFromLibComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private resourceService: ResourceService, private store: Store<any>, private display: DisplayService) {
    this.step = 1;
    this.resourceService.importResource({ type: data.type, scope: data.scope, version: data.version }).pipe(map((x) => x.data)).subscribe(
      (x) => { this.table_ = x; });
    this.store.select(selectAllDatatypes).pipe(take(1),
      map((all) => all.filter((x) => x.domainInfo.scope === Scope.USER)), map((table) => _.groupBy(table, (elm) => elm.fixedName))).subscribe((x) => this.availables = x);
  }
  ngOnInit() {
  }

  select($event: string) {
    this.resourceService.importResource({ type: this.data.type, scope: this.data.scope, version: $event }).pipe(map((x) => x.data)).subscribe(
      (x) => { this.table_ = x; });
  }

  selected($event: any[]) {
    // this.selectedData = $event;
  }

  submit() {
    // this.structure = { ...this.structure };
    // if (this.data.type === Type.EVENTS) {
    //   this.structure.substitutes = this.process();
    // }
    // this.dialogRef.close([this.structure]);
  }
  cancel() {
    this.dialogRef.close();
  }

  next() {
    this.step = 2;
  }

  back() {
    this.step = 1;
  }
  isValid() {
    //return this.form && this.form.valid;
  }

  filterTable($event: any) {

  }
  getDataTemplate() {
    if (this.data.type === Type.SEGMENT) {
      return this.segmentData;
    } else if (this.data.type === Type.EVENTS) {
      return this.messageData;
    }
  }

  selectMessageEvent(obj: any) {
    // this.resourceService.getReferencesChildStructures(obj.id).subscribe((x) => {
    //   this.duplicatedList = [];
    //   this.duplicated = {};
    //   this.children = x;
    //   if (x) {
    //     this.children.forEach((child) => {
    //       if (this.availables[child.fixedName]) {
    //         this.findDuplicated(this.availables[child.fixedName], child);
    //       }
    //       this.map[child.id] = {
    //         flavorId: child.id,
    //         newFlavor: true,
    //         ext: '',
    //       };
    //     });
    //   }
    //   this.structure = {
    //     originalId: obj.id,
    //     id: Guid.create().toString(),
    //     type: Type.EVENT,
    //     name: obj.name,
    //     structId: obj.parentStructId,
    //     ext: '',
    //     description: obj.description,
    //     domainInfo: { version: obj.hl7Version, scope: Scope.USER },
    //     flavor: true,
    //     role: Role.SenderAndReceiver,
    //     profileType: ProfileType.Constrainable,
    //   };
    //   this.step = 2;
    // });
  }

  private process(): ISubstitution[] {
    return this.children.map((child) => this.getSubstition(child));
  }

  private getSubstition(child: IDisplayElement): ISubstitution {
    return {
      type: child.type,
      originalId: child.id,
      newId: this.map[child.id].flavorId,
      create: this.map[child.id].newFlavor,
      ext: this.map[child.id].ext,
    };
  }

  modelChange($event: any, id: string) {
    this.map[id].flavorId = $event.value.id;
  }

  private findDuplicated(availables: IDisplayElement[], child: IDisplayElement) {
    availables.forEach((elm) => {
      // tslint:disable-next-line:align
      if (elm.structureIdentifier !== child.structureIdentifier) {
        // tslint:disable-next-line:no-collapsible-if
        if (this.duplicated[elm.fixedName]) {
          this.duplicated[elm.fixedName].push(elm);
        } else {
          this.duplicatedList.push(child);
          this.duplicated[elm.fixedName] = [elm];
        }
      }
    });
  }

  selectSegment(rowData) {
    const display: IDisplayElement = this.display.getDisplay(rowData);
    this.children = [display];
    console.log(display);
    console.log(this.children);
    this.duplicatedList = [];
    this.duplicated = {};
    if (this.availables[display.fixedName]) {
      this.findDuplicated(this.availables[display.fixedName], display);
    }
    this.structure = {
      originalId: rowData.id,
      id: Guid.create().toString(),
      type: Type.SEGMENT,
      name: rowData.name,
      fixedExt: rowData.fixedExtension,
      ext: '',
      description: rowData.description,
      domainInfo: { ...rowData.domainInfo, scope: Scope.USER },
      flavor: true,
    };
    this.step = 2;
  }

  getSelectedTemplate() {
    if (this.data.type === Type.SEGMENT) {
      return this.selectedSegment;
    } else if (this.data.type === Type.EVENTS) {
      return this.selectedMessage;
    }
  }
}
// tslint:disable-next-line:max-classes-per-file
export class NamingMap {
  [k: string]: IDisplayElement[];
}

