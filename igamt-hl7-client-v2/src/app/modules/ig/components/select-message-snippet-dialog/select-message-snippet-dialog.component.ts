import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IAvailableMessage } from '../ig-message-section-editor/ig-message-section-editor.component';

export interface ISelectMessageSnippetDialogData {
  availableMessages: IAvailableMessage[];
}

export interface ISelectMessageSnippetDialogResult {
  messageId: string;
  snippetId: string;  // null means whole message
  label: string;      // human-readable label of selection
}

interface TreeNode {
  id: string;
  label: string;
  type: 'profile' | 'message' | 'snippet';
  messageId?: string;
  children?: TreeNode[];
}

@Component({
  selector: 'app-select-message-snippet-dialog',
  templateUrl: './select-message-snippet-dialog.component.html',
  styleUrls: ['./select-message-snippet-dialog.component.scss'],
})
export class SelectMessageSnippetDialogComponent implements OnInit {

  tree: TreeNode[] = [];
  selectedNode: TreeNode = null;

  constructor(
    public dialogRef: MatDialogRef<SelectMessageSnippetDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ISelectMessageSnippetDialogData,
  ) {}

  ngOnInit() {
    this.buildTree();
  }

  buildTree() {
    // Group messages by profileName
    const profileMap = new Map<string, IAvailableMessage[]>();
    for (const msg of (this.data.availableMessages || [])) {
      const key = msg.profileName || 'Unknown Profile';
      if (!profileMap.has(key)) {
        profileMap.set(key, []);
      }
      profileMap.get(key).push(msg);
    }

    this.tree = [];
    profileMap.forEach((messages, profileName) => {
      const profileNode: TreeNode = {
        id: 'profile-' + profileName,
        label: profileName,
        type: 'profile',
        children: messages.map((msg) => {
          const messageNode: TreeNode = {
            id: msg.id,
            label: msg.name,
            type: 'message',
            messageId: msg.id,
            children: (msg.snippets || []).map((snippet) => ({
              id: snippet.id,
              label: snippet.name,
              type: 'snippet' as 'snippet',
              messageId: msg.id,
            })),
          };
          return messageNode;
        }),
      };
      this.tree.push(profileNode);
    });
  }

  selectNode(node: TreeNode) {
    if (node.type === 'profile') {
      return; // Can't select a profile, only messages or snippets
    }
    this.selectedNode = node;
  }

  isSelected(node: TreeNode): boolean {
    return this.selectedNode && this.selectedNode.id === node.id;
  }

  confirm() {
    if (!this.selectedNode) {
      return;
    }
    const result: ISelectMessageSnippetDialogResult = {
      messageId: this.selectedNode.type === 'message' ? this.selectedNode.id : this.selectedNode.messageId,
      snippetId: this.selectedNode.type === 'snippet' ? this.selectedNode.id : null,
      label: this.selectedNode.label,
    };
    this.dialogRef.close(result);
  }

  cancel() {
    this.dialogRef.close(null);
  }
}

