import { Component, Input, OnInit } from '@angular/core';
import { Type } from '../../constants/type.enum';
import { IVerificationEntryTable } from '../../services/verification.service';

export type VerificationDisplayActiveTypeSelector = (stats: IVerificationResultDisplay) => Type;

@Component({
  selector: 'app-verification-result-display',
  templateUrl: './verification-result-display.component.html',
  styleUrls: ['./verification-result-display.component.scss'],
})
export class VerificationResultDisplayComponent implements OnInit {

  @Input()
  verificationResult: IVerificationResultDisplay;
  @Input()
  documentId: string;
  @Input()
  activeSelector: VerificationDisplayActiveTypeSelector;
  @Input()
  showEmpty = true;
  active: Type;

  constructor() { }

  setActive(type: Type) {
    this.active = type;
  }

  ngOnInit() {
    if (this.activeSelector) {
      this.active = this.activeSelector(this.verificationResult);
    }
  }

}

export interface IVerificationResultDisplay {
  ig?: IVerificationEntryTable;
  compositeProfiles?: IVerificationEntryTable;
  conformanceProfiles?: IVerificationEntryTable;
  segments?: IVerificationEntryTable;
  datatypes?: IVerificationEntryTable;
  valueSets?: IVerificationEntryTable;
  coConstraintGroups?: IVerificationEntryTable;
}
