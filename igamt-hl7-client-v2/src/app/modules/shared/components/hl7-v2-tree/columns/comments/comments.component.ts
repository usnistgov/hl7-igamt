import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { IComment } from 'src/app/modules/shared/models/comment.interface';
import { IChange } from 'src/app/modules/shared/models/save-change';
import { ChangeType, PropertyType } from '../../../../models/save-change';
import { TextEditorDialogComponent } from '../../../text-editor-dialog/text-editor-dialog.component';
import { HL7v2TreeColumnComponent } from '../hl7-v2-tree-column.component';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent extends HL7v2TreeColumnComponent<IComment[]> implements OnInit {

  comments: IComment[];
  @Input() username: string;

  constructor(
    public dialog: MatDialog) {
    super([PropertyType.COMMENT], dialog);
    this.value$.subscribe(
      (value) => {
        if (value) {
          this.comments = [
            ...value,
          ];
        }
      },
    );
  }

  removeComment(i: number, list: IComment[]) {
    list.splice(i, 1);
    this.registerChange();
  }

  openDialog(comment?: IComment): void {

    const dialogRef = this.dialog.open(TextEditorDialogComponent, {
      data: {
        title: 'Comment',
        content: comment ? comment.description : '',
        plain: true,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (comment) {
          comment.description = result;
          comment.dateupdated = (new Date()).toISOString();
        } else {
          comment = {
            description: result,
            username: this.username,
            dateupdated: (new Date()).toISOString(),
          };
          this.comments.push(comment);
        }
        this.registerChange();
      }
    });
  }

  isActualChange<X>(change: IChange<X>): boolean {
    return true;
  }

  registerChange() {
    this.onChange(this.getInputValue(), this.comments, PropertyType.COMMENT, ChangeType.UPDATE);
  }

  ngOnInit() {
  }

}
