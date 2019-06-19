import { Status } from '../constants/status.enum';

export interface IPublicationInfo {
  publicationVersion: string;
  publicationDate?: any;
  status?: Status;
}
