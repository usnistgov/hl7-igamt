import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import * as _ from 'lodash';
import { combineLatest, EMPTY, from, Observable, throwError } from 'rxjs';
import * as fromDam from 'src/app/modules/dam-framework/store/index';
import { ExpandSideBar } from 'src/app/modules/dam-framework/store/data/dam.actions';
import { Notify } from 'src/app/modules/dam-framework/store/messages/messages.actions';
import { MessageType, UserMessage } from 'src/app/modules/dam-framework/models/messages/message.class';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { EditorID } from '../../../shared/models/editor.enum';
import { DamAbstractEditorComponent } from 'src/app/modules/dam-framework/services/dam-editor.component';
import { FroalaService } from 'src/app/modules/shared/services/froala.service';
import { catchError, concatMap, finalize, flatMap, map, mergeMap, take } from 'rxjs/operators';
import { ExampleMessagesService } from '../../services/example-messages.service';
import { selectIgExampleMessages } from 'src/app/root-store/example-messages/example-messages.reducer';
import { MessageService } from 'src/app/modules/dam-framework/services/message.service';
import { TreeComponent, TreeNode } from 'angular-tree-component';
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
  selectedElements: MessageElement[] = [];
  selectionMarkers: CodeMirror.TextMarker[] = [];
  messageHash: string | null = null;
  snippetId: string;
  snippetToHighlightPaths: string[] = [];
  activeTab: number = 0;
  messageName: string = '';
  messageDescription: string = '';
  snippetValidationWarnings: { snippetName: string, brokenPaths: string[] }[] = [];

  @ViewChild('codemirror') private codeEditor!: CodemirrorComponent;
  @ViewChild('treeroot') private parsedTree: TreeComponent;

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
        this.messageName = current.name || '';
        this.messageDescription = current.description || '';
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
      // Expand the sidebar when navigating with a snippetId
      if (snippetId) {
        this.store.dispatch(new ExpandSideBar());
      }
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
    if (this.staleMessageTree) {
      this.clearAllSelections();
    }
    this.change();
  }

  change() {
    this.editorChange(
      {
        message: this.message,
        narrativeHTML: this.narrative,
        name: this.messageName,
        description: this.messageDescription,
      },
      true,
    );
  }

  onMessageNameChange(name: string) {
    this.messageName = name;
    this.change();
  }

  onMessageDescriptionChange(description: string) {
    this.messageDescription = description;
    this.change();
  }

  editorDisplayNode(): Observable<IDisplayElement> {
    return EMPTY;
  }

  onEditorSave(action: fromDam.EditorSave): Observable<Action> {
    return combineLatest(this.igId$, this.current$).pipe(
      take(1),
      concatMap(([id, current]) => {
        return this.exampleMessagesService.saveExampleMessage(id, this.messageId, {
          message: current.data.message,
          narrative: current.data.narrativeHTML,
          name: current.data.name,
          description: current.data.description,
        }).pipe(
          flatMap((response) => {
            // Check for snippet validation warnings in the response data
            this.snippetValidationWarnings = [];
            if (response.data && response.data.snippetValidations) {
              const broken = response.data.snippetValidations.filter((v: any) => v.brokenPaths && v.brokenPaths.length > 0);
              this.snippetValidationWarnings = broken.map((v: any) => ({
                snippetName: v.snippetName || v.snippetId,
                brokenPaths: v.brokenPaths,
              }));
              // Dispatch a warning toast for each broken snippet
              if (broken.length > 0) {
                const names = broken.map((v: any) => v.snippetName || v.snippetId).join(', ');
                const warnMsg = `Warning: ${broken.length} snippet(s) have broken references after message change: ${names}`;
                this.store.dispatch(new Notify(new UserMessage(MessageType.WARNING, warnMsg, null, { closable: true, timeout: 8000 })));
              }
            }
            return from(this.parseMessage()).pipe(
              flatMap(() => {
                return [this.messageService.messageToAction(response), new fromDam.EditorUpdate({ value: current.data, updateDate: false }), new fromDam.SetValue({ selected: current.data })];
              })
            );
          }),
          catchError((error) => throwError(this.messageService.actionFromError(error))),
        );
      }),
    );
  }

  highlight(element: MessageElement, event?: MouseEvent) {
    if (event && (event.ctrlKey || event.metaKey)) {
      // Multi-select: toggle this element
      this.toggleSelect(element);
    } else {
      // Single select: clear previous and select only this one
      this.clearAllSelections();
      this.selected = element;
      this.selectedElements = [element];
      if (element && element.start && element.end) {
        this.markElement(element, 'cm-highlight');
      }
    }
  }

  toggleSelect(element: MessageElement) {
    const idx = this.selectedElements.findIndex(
      (e) => e.positionalPath === element.positionalPath
    );
    if (idx >= 0) {
      // Deselect
      this.selectedElements.splice(idx, 1);
    } else {
      // Add to selection
      this.selectedElements.push(element);
    }
    // Update the primary selected to the last one
    this.selected = this.selectedElements.length > 0
      ? this.selectedElements[this.selectedElements.length - 1]
      : null;
    // Re-render all highlights
    this.refreshSelectionMarkers();
  }

  isElementSelected(element: MessageElement): boolean {
    return this.selectedElements.some((e) => e.positionalPath === element.positionalPath);
  }

  clearAllSelections() {
    this.selected = null;
    this.selectedElements = [];
    this.clearAllMarkers();
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

  refreshSelectionMarkers() {
    this.clearAllMarkers();
    for (const element of this.selectedElements) {
      if (element.start && element.end) {
        this.markElement(element, 'cm-highlight');
      }
    }
  }

  markElement(element: MessageElement, className: string) {
    if (!element.start || !element.end || !this.codeEditor || !this.codeEditor.codeMirror) {
      return;
    }
    const editor = this.codeEditor.codeMirror;
    const doc = editor.getDoc();
    const start = CodeMirror.Pos(element.start.line - 1, element.start.column - 1);
    const end = CodeMirror.Pos(element.end.line - 1, element.end.column - 1);
    const marker = doc.markText(start, end, { className });
    this.selectionMarkers.push(marker);
    editor.scrollIntoView(start, 10);
  }

  createSnippet(element: MessageElement) {
    // Single element right-click: add it to selection if not already, then create
    if (!this.isElementSelected(element)) {
      this.clearAllSelections();
      this.selectedElements = [element];
      this.selected = element;
      this.refreshSelectionMarkers();
    }
    this.createSnippetFromSelection();
  }

  createSnippetFromSelection() {
    if (this.selectedElements.length === 0) {
      return;
    }
    const references = this.selectedElements
      .filter((e) => e.positionalPath)
      .map((e) => e.positionalPath);
    if (references.length === 0) {
      return;
    }

    const selectionSummary = this.selectedElements.map((e) => e.hl7Path || e.name).join(', ');

    this.dialog.open(CreateDialogComponent, {
      data: {
        title: 'Create Snippet',
        description: this.selectedElements.length > 1
          ? `Creating snippet from ${this.selectedElements.length} selected elements: ${selectionSummary}`
          : `Creating snippet from: ${selectionSummary}`,
      },
    }).afterClosed().pipe(
      take(1),
      mergeMap((data) => {
        if (!data || !data.name) {
          return EMPTY;
        }
        return this.igId$.pipe(
          take(1),
          mergeMap((igId) => {
            return this.exampleMessagesService.createExampleMessageSnippet(igId, this.messageId, {
              name: data.name,
              messageReferences: references,
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
            );
          }),
        );
      }),
    ).subscribe();
  }

  select(from: { line: number, column: number }, to: { line: number, column: number }) {
    if (!from || !to || !this.codeEditor || !this.codeEditor.codeMirror) {
      return;
    }
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
      this.snippetToHighlightPaths = [];
      return;
    }
    this.store.select(selectIgExampleMessages).pipe(
      take(1),
      map((igExampleMessages) => {
        const allMessages = igExampleMessages.profileExampleMessages
          .reduce((acc, profile) => [...acc, ...profile.exampleMessages], []);
        const message = allMessages.find((exampleMessage) => exampleMessage.id === this.messageId);
        if (!message || !message.snippets) {
          this.snippetToHighlightPaths = [];
          return;
        }
        const snippet = message.snippets.find((entry: IExampleMessageSnippet) => entry.id === this.snippetId);
        this.snippetToHighlightPaths = snippet && snippet.messageReferences && snippet.messageReferences.length > 0
          ? [...snippet.messageReferences]
          : [];
      }),
    ).subscribe();
  }

  private highlightSnippetIfAvailable() {
    if (!this.parsed || this.snippetToHighlightPaths.length === 0) {
      return;
    }
    this.clearAllSelections();
    for (const path of this.snippetToHighlightPaths) {
      const target = this.findByPositionalPath(this.parsed, path);
      if (target && target.start && target.end) {
        this.selectedElements.push(target);
      }
    }
    if (this.selectedElements.length > 0) {
      this.selected = this.selectedElements[this.selectedElements.length - 1];
      this.refreshSelectionMarkers();
      // Expand tree to show all selected paths
      setTimeout(() => {
        for (const path of this.snippetToHighlightPaths) {
          this.expandTreeToPath(path);
        }
      }, 200);
    }
  }

  /**
   * Walk the angular-tree-component tree and expand parents
   * so the node matching the given positionalPath is visible.
   */
  private expandTreeToPath(positionalPath: string) {
    if (!this.parsedTree || !this.parsedTree.treeModel) {
      return;
    }
    const roots = this.parsedTree.treeModel.roots || [];
    for (const root of roots) {
      if (this.expandNodeToPath(root, positionalPath)) {
        break;
      }
    }
  }

  private expandNodeToPath(treeNode: any, positionalPath: string): boolean {
    if (treeNode.data && treeNode.data.positionalPath === positionalPath) {
      treeNode.ensureVisible();
      return true;
    }
    if (treeNode.children) {
      for (const child of treeNode.children) {
        if (this.expandNodeToPath(child, positionalPath)) {
          return true;
        }
      }
    }
    return false;
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
    // Wait for CodeMirror to be ready, then add mousedown handler for multi-select
    setTimeout(() => this.setupEditorClickHandler(), 500);
  }

  setupEditorClickHandler() {
    if (!this.codeEditor || !this.codeEditor.codeMirror) {
      return;
    }
    const editor = this.codeEditor.codeMirror;
    editor.on('mousedown', (cm: any, event: MouseEvent) => {
      if (!this.parsed || this.staleMessageTree) {
        return;
      }
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
        const pos = cm.coordsChar({ left: event.clientX, top: event.clientY });
        // pos.line is 0-based, pos.ch is 0-based
        const line1 = pos.line + 1;
        const col1 = pos.ch + 1;
        const element = this.findElementAtPosition(this.parsed, line1, col1);
        if (element) {
          this.toggleSelect(element);
        }
      }
    });
  }

  /**
   * Find the deepest element in the parsed tree that contains the given position.
   */
  findElementAtPosition(node: any, line: number, column: number): MessageElement | null {
    if (!node) {
      return null;
    }
    const children = node.children || [];
    // Search children first (deepest match wins)
    for (const child of children) {
      const found = this.findElementAtPosition(child, line, column);
      if (found) {
        return found;
      }
    }
    // Check if this node contains the position
    if (node.start && node.end) {
      const afterStart = (line > node.start.line) || (line === node.start.line && column >= node.start.column);
      const beforeEnd = (line < node.end.line) || (line === node.end.line && column <= node.end.column);
      if (afterStart && beforeEnd) {
        return node as MessageElement;
      }
    }
    return null;
  }

}
