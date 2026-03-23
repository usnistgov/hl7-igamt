import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import * as _ from 'lodash';
import { combineLatest, EMPTY, from, Observable, throwError } from 'rxjs';
import * as fromDam from 'src/app/modules/dam-framework/store/index';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { EditorID } from '../../../shared/models/editor.enum';
import { DamAbstractEditorComponent } from 'src/app/modules/dam-framework/services/dam-editor.component';
import { FroalaService } from 'src/app/modules/shared/services/froala.service';
import { catchError, concatMap, finalize, flatMap, map, mergeMap, take } from 'rxjs/operators';
import { ExampleMessagesService } from '../../services/example-messages.service';
import { selectIgExampleMessages } from 'src/app/root-store/example-messages/example-messages.reducer';
import { MessageService } from 'src/app/modules/dam-framework/services/message.service';
import { TreeNode } from 'angular-tree-component';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import * as CodeMirror from 'codemirror';
import { IExampleMessageSnippet, MessageElement } from '../../domain/example-messages.model';
import { CreateDialogComponent } from '../create-dialog/create-dialog.component';

@Component({
  selector: 'app-message-editor',
  templateUrl: './message-editor.component.html',
  styleUrls: ['./message-editor.component.scss'],
})
export class MessageEditorComponent extends DamAbstractEditorComponent implements OnInit {

  message: string;
  narrative: string = '';
  messageId: string;
  igId$: Observable<string>;
  froalaConfig$: Observable<any>;
  parsed: any[];
  loading = false;
  options = {
    allowDrag: (node: TreeNode) => {
      return false;
    },
    actionMapping: {
      mouse: {
        click: () => { },
      },
    },
  };
  staleMessageTree = false;
  highlighted: CodeMirror.TextMarker | null = null;
  selected: MessageElement | null = null;
  messageHash: string | null = null;
  snippetId: string;
  snippetToHighlightPath: string | null = null;

  @ViewChild('codemirror') private codeEditor!: CodemirrorComponent;

  constructor(
    actions$: Actions,
    store: Store<any>,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private froalaService: FroalaService,
    private messageService: MessageService,
    private exampleMessagesService: ExampleMessagesService
  ) {
    super({
      id: EditorID.EXAMPLE_MESSAGE,
      title: '',
    }, actions$, store);
    this.froalaConfig$ = this.froalaService.getConfig();
    this.igId$ = store.select(selectIgExampleMessages).pipe(
      map((igExampleMessages) => {
        return igExampleMessages.id
      })
    )
    this.currentSynchronized$.pipe(
      map(async (current) => {
        this.message = current.message;
        this.narrative = current.narrativeHTML;
        this.messageId = current.id;
        this.resolveSnippetPath();
        if (this.message) {
          await this.parseMessage();
        }
      })
    ).subscribe();

    this.route.queryParamMap.pipe(
      map((params) => params.get('snippetId'))
    ).subscribe((snippetId) => {
      this.snippetId = snippetId;
      this.resolveSnippetPath();
      this.highlightSnippetIfAvailable();
    });
  }

  messageEditorOptions = {
    mode: 'hl7v2',
    lineNumbers: true,
    foldGutter: true,
    styleActiveLine: true,
    autoCloseTags: true,
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
    matchBrackets: true,
    extraKeys: { 'Alt-F': 'findPersistent' },
    lineWrapping: false,
    placeholder: '',
  };

  async getMessageHash() {
    const msgBuffer = new TextEncoder().encode(this.message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async messageChange() {
    await this.updateStaleMessageState();
    if (this.staleMessageTree && this.highlighted) {
      this.highlighted.clear();
      this.selected = null;
    }
    this.change();
  }

  change() {
    this.editorChange(
      {
        message: this.message,
        narrativeHTML: this.narrative,
      },
      true,
    );
  }

  editorDisplayNode(): Observable<IDisplayElement> {
    return EMPTY;
  }

  onEditorSave(action: fromDam.EditorSave): Observable<Action> {
    return combineLatest(this.igId$, this.current$).pipe(
      take(1),
      concatMap(([id, current]) => {
        console.log(current);
        return this.exampleMessagesService.saveExampleMessage(id, this.messageId, {
          message: current.data.message,
          narrative: current.data.narrativeHTML,
        }).pipe(
          flatMap((message) => {
            return from(this.parseMessage()).pipe(
              flatMap(() => {
                return [this.messageService.messageToAction(message), new fromDam.EditorUpdate({ value: current.data, updateDate: false }), new fromDam.SetValue({ selected: current.data })];
              })
            )
          }),
          catchError((error) => throwError(this.messageService.actionFromError(error))),
        )
      }),
    );
  }

  highlight(element: MessageElement) {
    this.selected = element;
    this.select(element.start, element.end);
  }

  createSnippet(element: MessageElement) {
    this.dialog.open(CreateDialogComponent, {
      data: {
        title: 'Create Snippet',
      },
    }).afterClosed().pipe(
      take(1),
      mergeMap((data) => {
        if (!data || !data.name || !element || !element.positionalPath) {
          return EMPTY;
        }
        return this.igId$.pipe(
          take(1),
          mergeMap((igId) => {
            return this.exampleMessagesService.createExampleMessageSnippet(igId, this.messageId, {
              name: data.name,
              messageReferences: [element.positionalPath],
            }).pipe(
              map((message) => {
                const actions = [];
                actions.push(this.messageService.messageToAction(message));
                if (message.data) {
                  actions.push(new fromDam.LoadPayloadData(message.data));
                }
                actions.forEach((action) => {
                  this.store.dispatch(action);
                });
              }),
              catchError((error) => {
                this.store.dispatch(this.messageService.actionFromError(error));
                return EMPTY;
              }),
            )
          }),
        );
      }),
    ).subscribe();
  }

  select(from: { line: number, column: number }, to: { line: number, column: number }) {
    const editor = this.codeEditor.codeMirror;
    const doc = editor.getDoc();

    const start = CodeMirror.Pos(from.line - 1, from.column - 1);
    const end = CodeMirror.Pos(to.line - 1, to.column - 1);

    if (this.highlighted) {
      this.highlighted.clear();
    }

    // Apply the highlight using markText
    const marker = doc.markText(start, end, {
      className: 'cm-highlight',
    });

    editor.scrollIntoView(start, 10);
    this.highlighted = marker;
  }

  async parseMessage() {
    this.loading = true;
    this.messageHash = await this.getMessageHash();
    this.igId$.pipe(
      take(1),
      mergeMap((igId) => {
        return this.exampleMessagesService.parseExampleMessage(igId, this.messageId).pipe(
          map(async (parsed) => {
            this.parsed = parsed;
            await this.updateStaleMessageState();
            this.highlightSnippetIfAvailable();
          })
        )
      }),
      finalize(() => {
        this.loading = false;
      })
    ).subscribe();
  }

  async updateStaleMessageState() {
    const hash = await this.getMessageHash();
    this.staleMessageTree = hash !== this.messageHash;
  }

  private resolveSnippetPath() {
    if (!this.snippetId || !this.messageId) {
      this.snippetToHighlightPath = null;
      return;
    }
    this.store.select(selectIgExampleMessages).pipe(
      take(1),
      map((igExampleMessages) => {
        const allMessages = igExampleMessages.profileExampleMessages
          .reduce((acc, profile) => [...acc, ...profile.exampleMessages], []);
        const message = allMessages.find((exampleMessage) => exampleMessage.id === this.messageId);
        if (!message || !message.snippets) {
          this.snippetToHighlightPath = null;
          return;
        }
        const snippet = message.snippets.find((entry: IExampleMessageSnippet) => entry.id === this.snippetId);
        this.snippetToHighlightPath = snippet && snippet.messageReferences && snippet.messageReferences.length > 0
          ? snippet.messageReferences[0]
          : null;
      }),
    ).subscribe();
  }

  private highlightSnippetIfAvailable() {
    if (!this.parsed || !this.snippetToHighlightPath) {
      return;
    }
    const target = this.findByPositionalPath(this.parsed, this.snippetToHighlightPath);
    if (target) {
      this.highlight(target);
    }
  }

  private findByPositionalPath(node: any, positionalPath: string): MessageElement | null {
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

  onDeactivate(): void {
  }

  ngOnInit() {
  }

}
