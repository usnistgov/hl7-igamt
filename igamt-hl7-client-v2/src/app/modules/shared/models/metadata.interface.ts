import { ICoustomAttribute } from "../../ig/components/ig-metadata-editor/ig-metadata-editor.component";

export interface IMetadata {
  title: string;
  version: string;
  hl7Versions: string[];
  topics: string;
  specificationName: string;
  identifier?: any;
  authors: string[];
  implementationNotes?: any;
  orgName?: string;
  coverPicture?: any;
  subTitle: string;
  scope?: any;
  authorNotes?: any;
  customAttributes?: ICoustomAttribute[];
}
