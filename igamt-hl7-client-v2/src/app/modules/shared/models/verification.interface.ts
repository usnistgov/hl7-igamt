import { Type } from '../constants/type.enum';
import { IHL7LocationInfo } from './binding.interface';
import { PropertyType } from './save-change';

export interface IVerificationIssue {
  code: string;
  target: string;
  targetType: Type;
  targetMeta?: any;
  description: string;
  location?: string;
  handleBy: HandleBy;
  severity: Severity;
  locationInfo: ILocation;
}

export enum HandleBy {
  USER = 'User',
  INTERNAL = 'Internal',
}

export enum Severity {
  ERROR = 'ERROR',
  WARNING = 'WARNING',
  FATAL = 'FATAL',
  INFORMATIONAL = 'INFORMATIONAL',
}

export interface ILocation {
  pathId: string;
  info: IHL7LocationInfo;
  name: string;
  property: PropertyType;
}

export interface IVerificationRequest{
  id: String,
  resourceType: Type,
  verificationType: VerificationType;

}

export interface IVerificationReport{


}

export enum VerificationType {

  COMPLIANCE = 'COMPLIANCE',
  VERIFICATION = 'VERIFICATION'

}
