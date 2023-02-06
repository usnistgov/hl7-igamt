import { IEvent, IMessageStructure } from '../../shared/models/conformance-profile.interface';
import { IDisplayElement } from '../../shared/models/display-element.interface';
import { ISegment } from '../../shared/models/segment.interface';

export interface ICustomStructureRegistry {
  messageStructureRegistry: IDisplayElement[];
  segmentStructureRegistry: IDisplayElement[];
}

export interface ICreateMessageStructure {
  name: string;
  description: string;
  from: string;
  version: string;
  events: IEvent[];
}

export interface ICreateSegmentStructure {
  identifier: string;
  description: string;
  from: string;
  zname?: string;
}

export interface IMessageStructureAndDisplay {
  structure: IMessageStructure;
  displayElement: IDisplayElement;
}

export interface ISegmentStructureAndDisplay {
  structure: ISegment;
  displayElement: IDisplayElement;
}
