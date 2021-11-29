import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { IChange } from 'src/app/modules/shared/models/save-change';
import { ChangeType, PropertyType } from '../../../../models/save-change';
import { TextEditorDialogComponent } from '../../../text-editor-dialog/text-editor-dialog.component';
import { IStringValue } from '../../hl7-v2-tree.component';
import { HL7v2TreeColumnComponent } from '../hl7-v2-tree-column.component';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
})
export class TextComponent extends HL7v2TreeColumnComponent<IStringValue> implements OnInit {

  definition: IStringValue;
  constructor(public dialog: MatDialog) {
    super([PropertyType.DEFINITIONTEXT], dialog);
    this.value$.subscribe((value) => {
      this.definition = value;
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(TextEditorDialogComponent, {
      data: {
        title: 'Definition Text',
        content: this.definition.value,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.definition.value = result;
      this.onChange(this.getInputValue().value, this.definition.value, PropertyType.DEFINITIONTEXT, ChangeType.UPDATE);
    });
  }

  isActualChange<X>(change: IChange<X>): boolean {
    return change.propertyValue !== change.oldPropertyValue;
  }

  ngOnInit() {
  }

}
