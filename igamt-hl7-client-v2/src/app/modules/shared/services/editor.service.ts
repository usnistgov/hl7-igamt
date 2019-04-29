import { Injectable } from '@angular/core';
import { Message } from '../../core/models/message/message.class';
import { EditorID } from '../models/editor.enum';

export abstract class EditorService<T> {

  constructor() { }

  abstract getEditorID(): EditorID;
  abstract getResourceType(): string;
  abstract save(): Message<any>;
  abstract redo(): void;
  abstract undo(): void;
  abstract registerChange(payload: T): void;
  abstract reset(): void;
}
