import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Type } from 'src/app/modules/shared/constants/type.enum';
import { ProfileComponentActions } from './../../../../root-store/profile-component/profile-component.actions';
import { IContent } from './../../../shared/models/content.interface';
import { ITypedSection } from './../ig-toc/ig-toc.component';

@Component({
  selector: 'app-manage-profile-structure',
  templateUrl: './manage-profile-structure.component.html',
  styleUrls: ['./manage-profile-structure.component.scss'],
})
export class ManageProfileStructureComponent implements OnInit {

  selectedSections: Type[] = [];
  checked = {};
  hasChildren = {};

  defaultOptions: IRegsitrySections[] = [
    {
      disabled: false,
      position: 1,
      label: 'Profile Components',
      registryType: Type.PROFILECOMPONENTREGISTRY,

    },
    {
      disabled: true,
      position: 2,
      label: 'Conformane Profiles',
      registryType: Type.CONFORMANCEPROFILEREGISTRY,

    },

    {
      disabled: false,
      position: 3,
      label: 'Composite Profiles',
      registryType: Type.COMPOSITEPROFILEREGISTRY,

    },
    {
      disabled: true,
      position: 4,
      label: 'Segments and Fields Descriptions',
      registryType: Type.SEGMENTREGISTRY,

    },
    {
      disabled: true,
      position: 5,
      label: 'Data Types',
      registryType: Type.DATATYPEREGISTRY,

    },
    {
      disabled: false,
      position: 6,
      label: 'Value Sets',
      registryType: Type.VALUESETREGISTRY,

    },
    {
      disabled: false,
      position: 7,
      label: 'Co-Constraint groups',
      registryType: Type.COCONSTRAINTGROUPREGISTRY,

    },

  ];

  constructor(
    public dialogRef: MatDialogRef<ManageProfileStructureComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.data.forEach((element) => {
      this.checked[element.type] = true;
      this.hasChildren[element.type] = element.children.length > 0;
    });

  }

  submit() {
    const added: IRegsitrySections[] = [];
    const removed: IRegsitrySections[] = [];

    const existing = {};
    this.data.forEach((element) => {
      existing[element.type] = true;
    });

    this.defaultOptions.forEach((element) => {

      if (!existing[element.registryType]) {

        if (this.checked[element.registryType]) {
          added.push(element);
        }
      } else {
        if (!this.checked[element.registryType]) {
          removed.push(element);
        }
      }
    });

    this.dialogRef.close({ added, removed });
  }

  ngOnInit() { }

}
export interface IRegsitrySections {
  disabled: boolean;
  position: number;
  label: string;
  registryType: Type;
  checked?: boolean;
}
