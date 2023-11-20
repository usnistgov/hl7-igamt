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
      const active = this.activeSelector(this.verificationResult);
      if (active) {
        this.active = active;
      } else {
        const entryTypes = [
          [Type.IGDOCUMENT, this.verificationResult.ig],
          [Type.CONFORMANCEPROFILE, this.verificationResult.conformanceProfiles],
          [Type.COMPOSITEPROFILE, this.verificationResult.compositeProfiles],
          [Type.COCONSTRAINTGROUP, this.verificationResult.coConstraintGroups],
          [Type.SEGMENT, this.verificationResult.segments],
          [Type.DATATYPE, this.verificationResult.datatypes],
          [Type.VALUESET, this.verificationResult.valueSets],
        ].filter(([type, elm]) => elm && (elm as IVerificationEntryTable).entries.length > 0)
          .map(([type, elm]) => type as Type);
        if (entryTypes.length > 0) {
          this.active = entryTypes[0];
        }
      }
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
