import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { IComment } from 'src/app/modules/shared/models/comment.interface';
import { ChangeType, PropertyType } from '../../../../models/save-change';
import { IBinding, IBindingContext } from '../../../../services/hl7-v2-tree.service';
import { TextEditorDialogComponent } from '../../../text-editor-dialog/text-editor-dialog.component';
import { HL7v2TreeColumnComponent } from '../hl7-v2-tree-column.component';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent extends HL7v2TreeColumnComponent<Array<IBinding<IComment[]>>> implements OnInit {

  comments: Array<IBinding<IComment[]>>;
  contextList: IBinding<IComment[]>;
  immutableList: Array<IBinding<IComment[]>>;
  _context: IBindingContext;
  @Input() username: string;
  @Input() set context(context: IBindingContext) {
    this._context = context;
    this.value$.subscribe(
      (value) => {
        this.comments = value || [];
        const node = this.getListForContext(context, this.comments);
        if (node) {
          this.contextList = node;
        } else {
          this.contextList = {
            context,
            level: 0,
            value: [],
          };
        }
        this.immutableList = this.comments.filter((elm) => !this.sameContext(this._context, elm.context));
      },
    );
  }

  constructor(public dialog: MatDialog) {
    super([PropertyType.COMMENT]);

  }

  getListForContext(ctx: IBindingContext, comments: Array<IBinding<IComment[]>>): IBinding<IComment[]> {
    return comments.find((elm) => {
      return this.sameContext(elm.context, ctx);
    });
  }

  removeComment(i: number, list: IComment[]) {
    list.splice(i, 1);
    this.registerChange();
  }

  sameContext(c1: IBindingContext, c2: IBindingContext): boolean {
    return c1.element === c2.element && c1.resource === c2.resource;
  }

  openDialog(comment?: IComment): void {
    const dialogRef = this.dialog.open(TextEditorDialogComponent, {
      data: {
        title: 'Comment',
        content: comment ? comment.description : '',
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
          this.contextList.value.push(comment);
        }
        this.registerChange();
      }
    });
  }

  registerChange() {
    const first = this.getListForContext(this._context, this.getInputValue() || []);
    this.onChange(first ? first.value : undefined, this.contextList.value, PropertyType.COMMENT, ChangeType.UPDATE);
  }

  ngOnInit() {
  }

}
