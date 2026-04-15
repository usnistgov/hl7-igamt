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
import { SelectMessageSnippetDialogComponent, ISelectMessageSnippetDialogResult } from '../select-message-snippet-dialog/select-message-snippet-dialog.component';

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
  selectionMarkers: CodeMirror.TextMarker[] = [];
  copied = false;
  hasClipboard = !!window.navigator['clipboard'];
  snippetName: string = null;

  // Warning/error messages
  messageNotFoundWarning: string = null;
  snippetWarnings: string[] = [];

  // The text displayed in CodeMirror: full message or snippet segment lines
  displayMessage: string = null;
  // Canonical snippet descriptor for the URL (e.g. "PID-3" or "L3-L5")
  snippetCanonical: string = null;
  // Human-readable snippet location info
  snippetLocationLabel: string = null;
  // Section title
  sectionLabel: string = '';

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
        if (data) {
          this.sectionLabel = data.label || '';
        }
        if (data && data.igId) {
          this.igId = data.igId;
          this.exampleMessagesUrl = `/example-messages/${data.igId}`;
          this.loadAvailableMessages(data.igId);

          if (data.messageId) {
            this.selectedMessageId = data.messageId;
            this.selectedSnippetId = data.snippetId || null;
            this.loadMessage(data.igId, data.messageId, data.snippetId);
          } else {
            this.resetMessageState();
          }
        } else {
          this.igId = null;
          this.exampleMessagesUrl = null;
          this.resetMessageState();
        }
      }),
    ).subscribe();
  }

  resetMessageState() {
    this.selectedMessageId = null;
    this.selectedSnippetId = null;
    this.messageUrl = null;
    this.exampleMessage = null;
    this.displayMessage = null;
    this.parsed = null;
    this.snippetName = null;
    this.snippetCanonical = null;
    this.snippetLocationLabel = null;
    this.messageNotFoundWarning = null;
    this.snippetWarnings = [];
  }

  /**
   * Build the URL with normal query params.
   * Format: /example-messages/{igId}/message/{messageId}
   * or:     /example-messages/{igId}/message/{messageId}?snippetId={snippetId}
   */
  buildMessageUrl(igId: string, messageId: string, snippetId?: string) {
    const host = window.location.protocol + '//' + window.location.host;
    this.messageUrl = host + '/example-messages/' + igId + '/message/' + messageId;
    if (snippetId) {
      this.messageUrl += '?snippetId=' + snippetId;
    }
  }

  loadMessage(igId: string, messageId: string, snippetId?: string) {
    this.loading = true;
    this.messageNotFoundWarning = null;
    this.snippetWarnings = [];
    this.exampleMessagesService.getExampleMessage(igId, messageId).pipe(
      map((msg) => {
        this.exampleMessage = msg;
        this.displayMessage = msg ? msg.message : null;
        this.loading = false;
        if (msg && msg.message && snippetId) {
          this.resolveSnippet(igId, messageId, snippetId);
        } else {
          this.snippetCanonical = null;
          this.snippetLocationLabel = null;
          this.buildMessageUrl(igId, messageId);
        }
      }),
      catchError(() => {
        this.exampleMessage = null;
        this.displayMessage = null;
        this.loading = false;
        this.messageNotFoundWarning = 'The attached example message could not be found. It may have been deleted.';
        return of(null);
      }),
    ).subscribe();
  }

  /**
   * Use the backend renderSnippet endpoint to resolve, parse, extract and highlight all parts.
   */
  resolveSnippet(igId: string, messageId: string, snippetId: string) {
    this.snippetWarnings = [];
    this.exampleMessagesService.renderSnippet(igId, messageId, snippetId).pipe(
      take(1),
      map((result) => {
        // Collect any warnings from the backend
        if (result.warnings && result.warnings.length > 0) {
          this.snippetWarnings = result.warnings;
        }

        // If the snippet was deleted, show full message with warning
        if (result.snippetNotFound) {
          this.snippetName = null;
          this.snippetCanonical = null;
          this.snippetLocationLabel = null;
          this.displayMessage = result.fullMessage || (this.exampleMessage ? this.exampleMessage.message : null);
          this.buildMessageUrl(igId, messageId);
          return;
        }

        this.snippetName = result.snippetName;
        this.displayMessage = result.renderedContent;
        this.buildMessageUrl(igId, messageId, snippetId);

        if (result.parts && result.parts.length > 0) {
          // Build canonical and location label from all parts
          const labels = result.parts.map((p) => {
            const hl7Path = p.hl7Path;
            const startLine = p.startLine;
            const endLine = p.endLine;
            return hl7Path || ('L' + startLine + (startLine !== endLine ? '-L' + endLine : ''));
          });
          this.snippetCanonical = labels.join(', ');

          const locationLabels = result.parts.map((p) => {
            const hl7Path = p.hl7Path;
            const startLine = p.startLine;
            const endLine = p.endLine;
            return hl7Path
              ? hl7Path + ' (line ' + startLine + (startLine !== endLine ? '-' + endLine : '') + ')'
              : 'Line ' + startLine + (startLine !== endLine ? '-' + endLine : '');
          });
          this.snippetLocationLabel = locationLabels.join(', ');

          // Apply highlights for ALL parts
          setTimeout(() => this.highlightAllParts(result.parts), 300);
        } else {
          this.snippetCanonical = null;
          this.snippetLocationLabel = null;
        }
      }),
      catchError(() => {
        this.snippetWarnings = ['The message may have changed since this snippet was created. The snippet could not be highlighted.'];
        this.displayMessage = this.exampleMessage ? this.exampleMessage.message : null;
        this.buildMessageUrl(igId, messageId);
        return of(null);
      }),
    ).subscribe();
  }

  /**
   * Highlight all snippet parts in the CodeMirror editor.
   */
  highlightAllParts(parts: { highlightStart: { line: number, column: number }, highlightEnd: { line: number, column: number } }[]) {
    this.clearAllMarkers();
    if (!this.codeEditor || !this.codeEditor.codeMirror || !parts || parts.length === 0) {
      return;
    }
    const editor = this.codeEditor.codeMirror;
    const doc = editor.getDoc();

    for (const part of parts) {
      if (!part.highlightStart || !part.highlightEnd) {
        continue;
      }
      const from = CodeMirror.Pos(part.highlightStart.line - 1, part.highlightStart.column - 1);
      const to = CodeMirror.Pos(part.highlightEnd.line - 1, part.highlightEnd.column - 1);
      const marker = doc.markText(from, to, { className: 'cm-snippet-highlight' });
      this.selectionMarkers.push(marker);
    }

    // Scroll to first highlight
    if (parts[0].highlightStart) {
      const firstLine = parts[0].highlightStart.line - 1;
      editor.scrollIntoView(CodeMirror.Pos(firstLine, 0), 50);
    }
  }

  clearAllMarkers() {
    if (this.highlighted) {
      this.highlighted.clear();
      this.highlighted = null;
    }
    for (const marker of this.selectionMarkers) {
      marker.clear();
    }
    this.selectionMarkers = [];
  }

  highlightRange(start: { line: number, column: number }, end: { line: number, column: number }) {
    if (!start || !end || !this.codeEditor || !this.codeEditor.codeMirror) {
      return;
    }
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

  onTitleChange(label: string) {
    this.sectionLabel = label;
    this.current$.pipe(
      take(1),
      map((current) => {
        this.editorChange({
          ...current.data,
          label,
        }, !!label);
      }),
    ).subscribe();
  }

  selectMessage(messageId: string) {
    this.selectedMessageId = messageId;
    this.selectedSnippetId = null;
    this.snippetName = null;
    this.snippetCanonical = null;
    this.snippetLocationLabel = null;
    this.displayMessage = null;
    this.messageNotFoundWarning = null;
    this.snippetWarnings = [];
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
      this.loadMessage(this.igId, messageId);
    } else {
      this.messageUrl = null;
      this.exampleMessage = null;
      this.displayMessage = null;
      this.parsed = null;
    }
  }

  selectSnippet(snippetId: string) {
    this.selectedSnippetId = snippetId;
    this.snippetWarnings = [];
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
      // Find snippet name
      const selectedMsg = this.availableMessages.find((m) => m.id === this.selectedMessageId);
      if (selectedMsg) {
        const snippet = selectedMsg.snippets.find((s) => s.id === snippetId);
        this.snippetName = snippet ? snippet.name : null;
      }
      this.resolveSnippet(this.igId, this.selectedMessageId, snippetId);
    } else {
      // No snippet selected — show full message
      this.snippetName = null;
      this.snippetCanonical = null;
      this.snippetLocationLabel = null;
      this.displayMessage = this.exampleMessage ? this.exampleMessage.message : null;
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
          this.applySelection(null, null);
        }
      }),
    ).subscribe();
  }

  openAttachDialog() {
    const dialogRef = this.dialog.open(SelectMessageSnippetDialogComponent, {
      data: {
        availableMessages: this.availableMessages,
      },
    });
    dialogRef.afterClosed().pipe(
      take(1),
      map((result: ISelectMessageSnippetDialogResult) => {
        if (result) {
          this.applySelection(result.messageId, result.snippetId);
        }
      }),
    ).subscribe();
  }

  applySelection(messageId: string, snippetId: string) {
    this.selectedMessageId = messageId;
    this.selectedSnippetId = snippetId;
    this.snippetName = null;
    this.snippetCanonical = null;
    this.snippetLocationLabel = null;
    this.displayMessage = null;
    this.messageNotFoundWarning = null;
    this.snippetWarnings = [];
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
            snippetId,
          },
          true,
        );
      }),
    ).subscribe();

    if (messageId && this.igId) {
      this.loadMessage(this.igId, messageId, snippetId);
    } else {
      this.messageUrl = null;
      this.exampleMessage = null;
      this.displayMessage = null;
      this.parsed = null;
    }
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
