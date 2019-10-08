import { Usage } from '../constants/usage.enum';
import { IAssertionConformanceStatement, IConformanceStatement, IFreeTextConformanceStatement } from './cs.interface';

export interface IPredicate extends IConformanceStatement {
  trueUsage: Usage;
  falseUsage: Usage;
}

export interface IAssertionPredicate extends IPredicate, IAssertionConformanceStatement {
}

export interface IFreeTextPredicate extends IPredicate, IFreeTextConformanceStatement {
}
