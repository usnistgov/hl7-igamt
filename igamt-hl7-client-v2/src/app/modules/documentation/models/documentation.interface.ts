import {IEditorMetadata} from '../../shared/models/editor.enum';

export enum DocumentationScope {
  GLOBAL = 'GLOBAL', USER = 'USER',
}
export interface IDocumentation {
  label?: string;
  description?: string;
  id?: string;
  scope?: DocumentationScope;
  type?: DocumentationType;
  authors?: string[];
  dateUpdated?: string;
  position?: number;
}
export enum DocumentationType {
  USERNOTES = 'USERNOTES',
  IMPLEMENTATIONDECISION = 'IMPLEMENTATIONDECISION',
  FAQ= 'FAQ',
  USERGUIDE = 'USERGUIDE',
  GLOSSARY = 'GLOSSARY',
  RELEASENOTE = 'RELEASENOTE',

}

export class IDocumentationWrapper {
  userguides?: IDocumentation[];
  faqs?: IDocumentation[];
  implementationDecesions?: IDocumentation[];
  releaseNotes?: IDocumentation[];
  userNotes?: IDocumentation[];
  glossary?: IDocumentation[];
}

export interface IDocumentationWorkspace {
  active: IDocumentationWorkspaceActive;
  flags: {
    changed: boolean;
    valid: boolean;
  };
  changeTime: Date;
  current: any;
  initial: any;
}

export interface IDocumentationWorkspaceActive {
  display: IDocumentation;
  editor: IEditorMetadata;
}
export interface IDocumentationWorkspaceCurrent {
  data: IDocumentation;
  valid: boolean;
  time: Date;
}
