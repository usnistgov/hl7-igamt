import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, flatMap, map, switchMap, take } from 'rxjs/operators';
import * as fromDam from 'src/app/modules/dam-framework/store/index';
import { IDisplayElement } from 'src/app/modules/shared/models/display-element.interface';
import * as fromIgamtDisplaySelectors from 'src/app/root-store/dam-igamt/igamt.resource-display.selectors';
import * as fromIgEdit from 'src/app/root-store/ig/ig-edit/ig-edit.index';
import { IgEditResolverLoad } from '../../../../root-store/ig/ig-edit/ig-edit.actions';
import { AbstractEditorComponent } from '../../../core/components/abstract-editor-component/abstract-editor-component.component';
import { MessageService } from '../../../dam-framework/services/message.service';
import { Type } from '../../../shared/constants/type.enum';
import { EditorID } from '../../../shared/models/editor.enum';
import { IgService } from '../../services/ig.service';
import { ExampleMessagesService } from '../../../example-messages/services/example-messages.service';
import { IExampleMessageDTO, IExampleMessageSnippet, MessageElement } from '../../../example-messages/domain/example-messages.model';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import * as CodeMirror from 'codemirror';
import { ConfirmDialogComponent } from '../../../dam-framework/components/fragments/confirm-dialog/confirm-dialog.component';

export interface IAvailableMessage {
  id: string;
  name: string;
  profileName: string;
  snippets: IExampleMessageSnippet[];
}

@Component({
  selector: 'app-ig-message-section-editor',
  templateUrl: './ig-message-section-editor.component.html',
  styleUrls: ['./ig-message-section-editor.component.scss'],
})
export class IgMessageSectionEditorComponent extends AbstractEditorComponent implements OnInit {

  exampleMessage: IExampleMessageDTO = null;
  exampleMessagesUrl: string = null;
  messageUrl: string = null;
  loading = false;
  loadingMessages = false;
  availableMessages: IAvailableMessage[] = [];
  selectedMessageId: string = null;
  selectedSnippetId: string = null;
  igId: string = null;
  parsed: any = null;
  highlighted: CodeMirror.TextMarker | null = null;
  copied = false;
  hasClipboard = !!window.navigator['clipboard'];
  snippetName: string = null;

  @ViewChild('codemirror') private codeEditor: CodemirrorComponent;

  messageEditorOptions = {
    mode: 'hl7v2',
    lineNumbers: true,
    foldGutter: true,
    readOnly: true,
    cursorBlinkRate: -1,
    styleActiveLine: false,
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
    matchBrackets: true,
    lineWrapping: false,
  };

  constructor(
    store: Store<any>,
    actions$: Actions,
    private igService: IgService,
    private messageService: MessageService,
    private exampleMessagesService: ExampleMessagesService,
    private dialog: MatDialog,
  ) {
    super({
      id: EditorID.MESSAGE_SECTION,
      title: 'Message Example',
      resourceType: Type.MESSAGESECTION,
    },
      actions$,
      store,
    );
  }

  ngOnInit() {
    this.currentSynchronized$.pipe(
      map((data) => {
        if (data && data.igId) {
          this.igId = data.igId;
          this.exampleMessagesUrl = `/example-messages/${data.igId}`;
          this.loadAvailableMessages(data.igId);

          if (data.messageId) {
            this.selectedMessageId = data.messageId;
            this.selectedSnippetId = data.snippetId || null;
            this.buildMessageUrl(data.igId, data.messageId, data.snippetId);
            this.loadMessage(data.igId, data.messageId, data.snippetId);
          } else {
            this.selectedMessageId = null;
            this.selectedSnippetId = null;
            this.messageUrl = null;
            this.exampleMessage = null;
            this.parsed = null;
            this.snippetName = null;
          }
        } else {
          this.igId = null;
          this.exampleMessagesUrl = null;
          this.messageUrl = null;
          this.exampleMessage = null;
          this.parsed = null;
          this.snippetName = null;
        }
      }),
    ).subscribe();
  }

  buildMessageUrl(igId: string, messageId: string, snippetId?: string) {
    const host = window.location.protocol + '//' + window.location.host;
    this.messageUrl = host + '/example-messages/' + igId + '?messageId=' + messageId;
    if (snippetId) {
      this.messageUrl += '&snippetId=' + snippetId;
    }
  }

  loadMessage(igId: string, messageId: string, snippetId?: string) {
    this.loading = true;
    this.exampleMessagesService.getExampleMessage(igId, messageId).pipe(
      map((msg) => {
        this.exampleMessage = msg;
        this.loading = false;
        if (msg && msg.message && snippetId) {
          this.resolveAndHighlightSnippet(igId, messageId, snippetId);
        }
      }),
      catchError(() => {
        this.exampleMessage = null;
        this.loading = false;
        return of(null);
      }),
    ).subscribe();
  }

  resolveAndHighlightSnippet(igId: string, messageId: string, snippetId: string) {
    // First get the snippet's positional path from the IG example messages
    this.exampleMessagesService.getIgExampleMessages(igId).pipe(
      take(1),
      map((igExampleMessages) => {
        let snippetPath: string = null;
        if (igExampleMessages && igExampleMessages.profileExampleMessages) {
          for (const profileMessages of igExampleMessages.profileExampleMessages) {
            for (const msg of profileMessages.exampleMessages) {
              if (msg.id === messageId && msg.snippets) {
                const snippet = msg.snippets.find((s) => s.id === snippetId);
                if (snippet) {
                  this.snippetName = snippet.name;
                  if (snippet.messageReferences && snippet.messageReferences.length > 0) {
                    snippetPath = snippet.messageReferences[0];
                  }
                }
              }
            }
          }
        }
        if (snippetPath) {
          this.parseAndHighlight(igId, messageId, snippetPath);
        }
      }),
      catchError(() => of(null)),
    ).subscribe();
  }

  parseAndHighlight(igId: string, messageId: string, positionalPath: string) {
    this.exampleMessagesService.parseExampleMessage(igId, messageId).pipe(
      take(1),
      map((parsedResult) => {
        this.parsed = parsedResult;
        const target = this.findByPositionalPath(parsedResult, positionalPath);
        if (target) {
          // Wait for CodeMirror to render then highlight
          setTimeout(() => this.highlightRange(target.start, target.end), 300);
        }
      }),
      catchError(() => {
        this.parsed = null;
        return of(null);
      }),
    ).subscribe();
  }

  highlightRange(start: { line: number, column: number }, end: { line: number, column: number }) {
    if (this.codeEditor && this.codeEditor.codeMirror) {
      const editor = this.codeEditor.codeMirror;
      const doc = editor.getDoc();
      const from = CodeMirror.Pos(start.line - 1, start.column - 1);
      const to = CodeMirror.Pos(end.line - 1, end.column - 1);

      if (this.highlighted) {
        this.highlighted.clear();
      }

      this.highlighted = doc.markText(from, to, {
        className: 'cm-snippet-highlight',
      });
      editor.scrollIntoView(from, 10);
    }
  }

  findByPositionalPath(node: any, positionalPath: string): MessageElement | null {
    if (!node) {
      return null;
    }
    if (node.positionalPath === positionalPath) {
      return node as MessageElement;
    }
    if (!node.children || node.children.length === 0) {
      return null;
    }
    for (const child of node.children) {
      const found = this.findByPositionalPath(child, positionalPath);
      if (found) {
        return found;
      }
    }
    return null;
  }

  loadAvailableMessages(igId: string) {
    this.loadingMessages = true;
    this.exampleMessagesService.getIgExampleMessages(igId).pipe(
      map((igExampleMessages) => {
        this.availableMessages = [];
        if (igExampleMessages && igExampleMessages.profileExampleMessages) {
          for (const profileMessages of igExampleMessages.profileExampleMessages) {
            const profileLabel = profileMessages.profile
              ? (profileMessages.profile.fixedName || '') +
                (profileMessages.profile.variableName ? '#' + profileMessages.profile.variableName : '')
              : 'Unknown Profile';
            for (const msg of profileMessages.exampleMessages) {
              this.availableMessages.push({
                id: msg.id,
                name: msg.name,
                profileName: profileLabel,
                snippets: msg.snippets || [],
              });
            }
          }
        }
        this.loadingMessages = false;
      }),
      catchError(() => {
        this.loadingMessages = false;
        return of(null);
      }),
    ).subscribe();
  }

  dataChange(form: FormGroup) {
    this.current$.pipe(
      take(1),
      map((current) => {
        const formValue = form.getRawValue();
        this.editorChange({
          ...current.data,
          ...formValue,
        }, form.valid);
      }),
    ).subscribe();
  }

  selectMessage(messageId: string) {
    this.selectedMessageId = messageId;
    this.selectedSnippetId = null;
    this.snippetName = null;
    if (this.highlighted) {
      this.highlighted.clear();
      this.highlighted = null;
    }
    this.current$.pipe(
      take(1),
      map((current) => {
        this.editorChange(
          {
            ...current.data,
            messageId,
            snippetId: null,
          },
          true,
        );
      }),
    ).subscribe();

    if (messageId && this.igId) {
      this.buildMessageUrl(this.igId, messageId);
      this.loadMessage(this.igId, messageId);
    } else {
      this.messageUrl = null;
      this.exampleMessage = null;
      this.parsed = null;
    }
  }

  selectSnippet(snippetId: string) {
    this.selectedSnippetId = snippetId;
    this.current$.pipe(
      take(1),
      map((current) => {
        this.editorChange(
          {
            ...current.data,
            snippetId,
          },
          true,
        );
      }),
    ).subscribe();

    if (snippetId && this.igId && this.selectedMessageId) {
      this.buildMessageUrl(this.igId, this.selectedMessageId, snippetId);
      // Find snippet name
      const selectedMsg = this.availableMessages.find((m) => m.id === this.selectedMessageId);
      if (selectedMsg) {
        const snippet = selectedMsg.snippets.find((s) => s.id === snippetId);
        this.snippetName = snippet ? snippet.name : null;
      }
      this.resolveAndHighlightSnippet(this.igId, this.selectedMessageId, snippetId);
    } else {
      this.snippetName = null;
      this.buildMessageUrl(this.igId, this.selectedMessageId);
      if (this.highlighted) {
        this.highlighted.clear();
        this.highlighted = null;
      }
    }
  }

  get selectedMessageSnippets(): IExampleMessageSnippet[] {
    if (!this.selectedMessageId || !this.availableMessages) {
      return [];
    }
    const msg = this.availableMessages.find((m) => m.id === this.selectedMessageId);
    return msg ? msg.snippets : [];
  }

  detachMessage() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        question: 'Are you sure you want to detach the example message from this section?',
        action: 'Detach',
      },
    });
    dialogRef.afterClosed().pipe(
      take(1),
      map((confirmed) => {
        if (confirmed) {
          this.selectMessage(null);
        }
      }),
    ).subscribe();
  }

  copyUrl() {
    if (this.messageUrl && this.hasClipboard) {
      window.navigator['clipboard'].writeText(this.messageUrl);
      this.copied = true;
      setTimeout(() => {
        this.copied = false;
      }, 1500);
    }
  }

  editorDisplayNode(): Observable<IDisplayElement> {
    return this.elementId$.pipe(
      switchMap((elementId) => {
        return this.store.select(fromIgamtDisplaySelectors.selectSectionDisplayById, { id: elementId });
      }),
    );
  }

  onEditorSave(action: fromDam.EditorSave): Observable<Action> {
    return combineLatest(this.elementId$, this.store.select(fromIgEdit.selectIgDocument), this.current$)
      .pipe(
        take(1),
        flatMap(([_id, ig, current]) => {
          return this.igService.saveTextSection(ig.id, {
            ...current.data,
          }).pipe(
            flatMap((response) => {
              return [
                this.messageService.messageToAction(response),
                new fromDam.EditorUpdate({ value: current.data, updateDate: false }),
                new fromDam.SetValue({ selected: current.data }),
                new IgEditResolverLoad(ig.id),
              ];
            }),
            catchError((error) => {
              return of(this.messageService.actionFromError(error));
            }),
          );
        }),
      );
  }

  onDeactivate(): void {
  }
}

