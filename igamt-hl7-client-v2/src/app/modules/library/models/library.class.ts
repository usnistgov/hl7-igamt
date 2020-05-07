import {IDocument} from '../../document/models/document/IDocument.interface';
import {IRegistry} from '../../shared/models/registry.interface';

export interface ILibrary extends IDocument {
  datatypeRegistry: IRegistry;
  valueSetRegistry?: IRegistry;
  label?: any;
}
